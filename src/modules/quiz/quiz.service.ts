import type { Request, Response } from "express";
import { QuizModel, QuizQuestionsModel } from "../../db/models/index.ts";
import {
  QuizQuestionsRepository,
  QuizRepository,
} from "../../db/repositories/index.ts";
import successHandler from "../../utils/handlers/success.handler.ts";
import type {
  CheckQuizAnswersBodyDtoType,
  CheckQuizAnswersParamsDtoType,
  CreateQuizBodyDtoType,
  GetQuizParamsDtoType,
  UpdateQuizBodyDtoType,
  UpdateQuizParamsDtoType,
} from "./quiz.dto.ts";
import {
  QuestionTypesEnum,
  QuizTypesEnum,
  RolesEnum,
} from "../../utils/constants/enum.constants.ts";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  ServerException,
  ValidationException,
} from "../../utils/exceptions/custom.exceptions.ts";
import StringConstants from "../../utils/constants/strings.constants.ts";
import QuizUtil from "../../utils/quiz/utils.quiz.ts";
import UpdateUtil from "../../utils/update/util.update.ts";
import type { HIQuiz } from "../../db/interfaces/quiz.interface.ts";
import type {
  IGetQuizDetailsResponse,
  IGetQuizQuestionsResponse,
} from "./quiz.entity.ts";
import EnvFields from "../../utils/constants/env_fields.constants.ts";
import type {
  IAIModelCheckWrittenQuestionsRequest,
  IAIModelCheckWrittenQuestionsResponse,
  IAIModelGeneratedQuestionsRequest,
  IAIModelGeneratedQuestionsResponse,
} from "../../utils/constants/interface.constants.ts";
import makeCompleter from "../../utils/completer/make.completer.ts";

class QuizService {
  private _quizRepository = new QuizRepository(QuizModel);
  private _quizQuestionsRepository = new QuizQuestionsRepository(
    QuizQuestionsModel
  );
  //private _quizApisManager = new QuizApisManager();

  createQuiz = async (req: Request, res: Response): Promise<Response> => {
    const { title, description, aiPrompt, type, duration, tags } = req
      .validationResult.body as CreateQuizBodyDtoType;

    if (type === QuizTypesEnum.careerAssessment) {
      const quiz = await this._quizRepository.findOne({ filter: { type } });
      if (quiz) {
        throw new ConflictException(
          `Quiz of type ${QuizTypesEnum.careerAssessment} already exists 🚫`
        );
      }
    }

    const uniqueKey = QuizUtil.getQuizUniqueKey({
      title: title!,
      tags: tags!,
    });

    if (
      await this._quizRepository.findOne({
        filter: { uniqueKey },
      })
    ) {
      throw new ConflictException(
        "A quiz with the same title and tags already exists ❌"
      );
    }

    await this._quizRepository.create({
      data: [
        {
          uniqueKey,
          title: title!,
          description,
          aiPrompt,
          type,
          duration,
          tags,
          createdBy: req.user!._id!,
        },
      ],
    });

    return successHandler({
      res,
      message: StringConstants.CREATED_SUCCESSFULLY_MESSAGE("Quiz"),
    });
  };

  updateQuiz = async (req: Request, res: Response): Promise<Response> => {
    const { quizId } = req.params as UpdateQuizParamsDtoType;
    const { title, description, aiPrompt, type, duration, tags } = req
      .validationResult.body as UpdateQuizBodyDtoType;

    const quiz = await this._quizRepository.findOne({
      filter: { _id: quizId, paranoid: false },
    });

    if (!quiz) {
      throw new NotFoundException(
        StringConstants.INVALID_PARAMETER_MESSAGE("quizId")
      );
    }

    const uniqueKey = QuizUtil.getQuizUniqueKey({
      title: title || quiz.title,
      tags: tags || quiz.tags!,
    });

    if (
      quiz.type === QuizTypesEnum.careerAssessment &&
      (type || duration || tags?.length)
    ) {
      throw new ValidationException(
        `Only description and aiPrompt of ${StringConstants.CAREER_ASSESSMENT} can be updated 🔒`
      );
    } else {
      if (type === QuizTypesEnum.careerAssessment) {
        throw new BadRequestException(
          `${QuizTypesEnum.stepQuiz} can not be update to ${QuizTypesEnum.careerAssessment} 🔒`
        );
      }
      if (title || tags) {
        if (
          await this._quizRepository.findOne({
            filter: { uniqueKey },
          })
        ) {
          throw new ConflictException(
            "A quiz with the same title and tags already exists ❌"
          );
        }
      }
    }

    const updateObject = UpdateUtil.getChangedFields<HIQuiz>({
      document: quiz,
      updatedObject: { title, description, aiPrompt, type, duration, tags },
    });

    await quiz.updateOne({
      uniqueKey:
        updateObject.title || updateObject.tags?.length ? uniqueKey : undefined,
      ...updateObject,
    });

    return successHandler({
      res,
      message: StringConstants.CREATED_SUCCESSFULLY_MESSAGE("Quiz"),
    });
  };

  getQuizDetails = async (req: Request, res: Response): Promise<Response> => {
    const { quizId } = req.params as GetQuizParamsDtoType;

    const projection: { aiPrompt?: 1 | 0; tags?: 1 | 0 } = {};
    if (req.user!.role === RolesEnum.user) {
      projection.aiPrompt = 0;
      projection.tags = 0;
    }

    const filter: { _id?: string; uniqueKey?: Record<any, any> } = {};
    quizId === QuizTypesEnum.careerAssessment
      ? (filter.uniqueKey = {
          $regex: StringConstants.CAREER_ASSESSMENT,
          $options: "i",
        })
      : (filter._id = quizId);

    const quiz = await this._quizRepository.findOne({
      filter: {
        ...filter,
        paranoid: req.user!.role !== RolesEnum.user ? false : true,
      },
      projection,
    });

    if (!quiz) {
      throw new NotFoundException(
        StringConstants.INVALID_PARAMETER_MESSAGE("quizId")
      );
    }

    return successHandler<IGetQuizDetailsResponse>({ res, body: { quiz } });
  };

  private _generateQuestions = async ({
    title,
    aiPrompt,
  }: IAIModelGeneratedQuestionsRequest): Promise<IAIModelGeneratedQuestionsResponse> => {
    return {
      questions: [
        {
          type: "mcq-single" as QuestionTypesEnum,
          text: "Which data structure uses LIFO (Last In, First Out) principle?",
          options: ["Queue", "Stack", "Array", "Linked List"],
          correctAnswer: "Stack",
          explanation:
            "A stack follows the LIFO principle, meaning the last element added is the first to be removed.",
        },
        {
          type: "mcq-single" as QuestionTypesEnum,
          text: "What is the time complexity of binary search in a sorted array?",
          options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
          correctAnswer: "O(log n)",
          explanation:
            "Binary search halves the search space each time, resulting in logarithmic complexity O(log n).",
        },
        {
          type: "mcq-multi" as QuestionTypesEnum,
          text: "Which of the following are programming paradigms?",
          options: [
            "Object-Oriented",
            "Functional",
            "Procedural",
            "Relational",
          ],
          correctAnswer: ["Object-Oriented", "Functional", "Procedural"],
          explanation:
            "Object-Oriented, Functional, and Procedural are paradigms; Relational refers to databases, not a paradigm.",
        },
        {
          type: "written" as QuestionTypesEnum,
          text: "Explain the difference between TCP and UDP.",
        },
        {
          type: "mcq-single" as QuestionTypesEnum,
          text: "Which algorithm is commonly used for shortest path in a graph?",
          options: [
            "Dijkstra's Algorithm",
            "Merge Sort",
            "DFS",
            "Bellman-Ford",
          ],
          correctAnswer: "Dijkstra's Algorithm",
          explanation:
            "Dijkstra's algorithm efficiently finds the shortest path from a source to all other nodes in a weighted graph.",
        },
        {
          type: "mcq-single" as QuestionTypesEnum,
          text: "What does SQL stand for?",
          options: [
            "Structured Query Language",
            "Simple Query Language",
            "Sequential Query Language",
            "Standard Query Language",
          ],
          correctAnswer: "Structured Query Language",
          explanation:
            "SQL stands for Structured Query Language, used for managing and querying relational databases.",
        },
        {
          type: "mcq-multi" as QuestionTypesEnum,
          text: "Which of the following are NoSQL databases?",
          options: ["MongoDB", "PostgreSQL", "Cassandra", "Redis"],
          correctAnswer: ["MongoDB", "Cassandra", "Redis"],
          explanation:
            "MongoDB, Cassandra, and Redis are NoSQL databases; PostgreSQL is a relational database.",
        },
        {
          type: "written" as QuestionTypesEnum,
          text: "Describe the concept of polymorphism in object-oriented programming.",
        },
        {
          type: "mcq-single" as QuestionTypesEnum,
          text: "Which of these is NOT a valid HTTP method?",
          options: ["GET", "POST", "FETCH", "DELETE"],
          correctAnswer: "FETCH",
          explanation:
            "GET, POST, and DELETE are valid HTTP methods; FETCH is not an HTTP method but a JavaScript API.",
        },
        {
          type: "written" as QuestionTypesEnum,
          text: "What is the difference between supervised and unsupervised learning in machine learning?",
        },
      ],
    };
  };

  getQuizQuestions = async (req: Request, res: Response): Promise<Response> => {
    const { quizId } = req.params as GetQuizParamsDtoType;

    const filter: { _id?: string; uniqueKey?: Record<any, any> } = {};
    quizId === QuizTypesEnum.careerAssessment
      ? (filter.uniqueKey = {
          $regex: StringConstants.CAREER_ASSESSMENT,
          $options: "i",
        })
      : (filter._id = quizId);

    const quiz = await this._quizRepository.findOne({
      filter: {
        ...filter,
        paranoid: req.user!.role !== RolesEnum.user ? false : true,
      },
    });

    if (!quiz) {
      throw new NotFoundException(
        StringConstants.INVALID_PARAMETER_MESSAGE("quizId")
      );
    }

    const [_, generatedQuestions] = await Promise.all([
      this._quizQuestionsRepository.deleteOne({
        filter: { quizId: quiz._id, userId: req.user!._id! },
      }),
      this._generateQuestions({
        title: quiz.title,
        aiPrompt: quiz.aiPrompt,
      }),
    ]);

    // await this._quizApisManager.getQuizQustions({
    //   title: quiz.title,
    //   aiPrompt: quiz.aiPrompt,
    // });

    const writtenQuestionsIndexes: number[] = [];

    generatedQuestions.questions.forEach((value, index) => {
      if (value.type === QuestionTypesEnum.written)
        writtenQuestionsIndexes.push(index);
    });
    let [quizQuestions] = await this._quizQuestionsRepository.create({
      data: [
        {
          quizId: quiz._id,
          userId: req.user!._id!,
          writtenQuestionsIndexes,
          questions: generatedQuestions.questions,
          expiresAt: new Date(
            Date.now() +
              (quizId === QuizTypesEnum.careerAssessment
                ? Number(
                    process.env[
                      EnvFields.CAREER_ASSESSMENT_QUESTIONS_EXPIRES_IN_SECONDS
                    ]
                  )
                : quiz.duration! +
                  Number(
                    process.env[EnvFields.QUIZ_QUESTIONS_EXPIRES_IN_SECONDS]
                  )) *
                1000
          ),
        },
      ],
    });

    if (!quizQuestions) {
      throw new ServerException("Failed to generate quiz questions ❓");
    }

    return successHandler<IGetQuizQuestionsResponse>({
      res,
      body: {
        quiz: quizQuestions,
      },
    });
  };

  private _checkWrittenQuestionsAnswers = async ({
    resolve,
    title,
    aiPrompt,
    writtenAnswers,
  }: IAIModelCheckWrittenQuestionsRequest & { resolve: () => void }): Promise<
    IAIModelCheckWrittenQuestionsResponse[]
  > => {
    return new Promise((res) => {
      const response = [];
      for (const answer of writtenAnswers) {
        if (answer.userAnswer.includes("correct")) {
          response.push({
            questionId: answer.questionId,
            isCorrect: true,
          });
        } else {
          response.push({
            questionId: answer.questionId,
            isCorrect: false,
            correction: "This is the correction of user answer",
            explenation: "This is the explanation of user answer",
          });
        }
      }
      res(response);
      resolve();
    });
  };

  checkQuizAnswers = async (req: Request, res: Response): Promise<Response> => {
    console.log(this._checkWrittenQuestionsAnswers);

    const { quizId } = req.params as CheckQuizAnswersParamsDtoType;
    const { answers } = req.validationResult
      .body as CheckQuizAnswersBodyDtoType;

    const quizQuestions = await this._quizQuestionsRepository.findOne({
      filter: { quizId, userId: req.user!._id! },
      options: {
        populate: [
          {
            path: "quizId",
            match: { freezed: { $exists: false } },
            select: "title aiPrompt",
          },
        ],
      },
    });

    if (!quizQuestions) {
      throw new NotFoundException(
        "Quiz questions not found for the given quizId and user 🚫"
      );
    }

    if (answers.length !== quizQuestions.questions.length) {
      throw new ValidationException(
        "Number of answers provided does not match number of questions ❌"
      );
    }

    const writtenAnswers: { questionId: string; userAnswer: string }[] = [];
    for (const answer of answers) {
      const questionType = quizQuestions.answersMap.get(answer.questionId);
      if (!questionType) {
        throw new NotFoundException(
          "Not found questionId in the quiz questions ❌"
        );
      } else if (questionType && questionType !== answer.type) {
        throw new ValidationException(
          `Question type mismatch for questionId ${answer.questionId} ❌`
        );
      }
      if (answer.type === QuestionTypesEnum.written) {
        writtenAnswers.push({
          questionId: answer.questionId,
          userAnswer: answer.answer as string,
        });
      }
    }

    // send written questions to AI model for checking
    const gate = makeCompleter();
    const writtenAnswersResults = await this._checkWrittenQuestionsAnswers({
      resolve: gate.resolve as unknown as () => void,
      title: (quizQuestions.quizId as unknown as HIQuiz).title,
      aiPrompt: (quizQuestions.quizId as unknown as HIQuiz).aiPrompt!,
      writtenAnswers,
    });

    const checkedAnswers = [];
    let wrongAnswersCount = 0;
    for (const answer of answers) {
      const question = quizQuestions.questions.find((value) =>
        value.id?.equals(answer.questionId)
      )!;

      if (question.type === QuestionTypesEnum.written) continue;

      const selectedAnswer =
        (answer.answer as number) < 0
          ? ""
          : question.options![answer.answer as number];

      const { correctAnswer, explanation, ...rest } = question;
      if (selectedAnswer == question.correctAnswer) {
        checkedAnswers.push({ ...rest, correctAnswer: selectedAnswer });
      } else {
        wrongAnswersCount++;
        checkedAnswers.push({
          ...rest,
          wrongAnswer: selectedAnswer,
          correction: correctAnswer,
          explanation,
        });
      }
    }

    await gate.promise;

    for (const writtenAnswerResult of writtenAnswersResults) {
      let index;
      const question = quizQuestions.questions.find((value, i) => {
        index = i;
        return value.id?.equals(writtenAnswerResult.questionId);
      })!;
      if (writtenAnswerResult.isCorrect) {
        checkedAnswers.splice(index!, 0, {
          ...question,
          correctAnswer: writtenAnswers.find(
            (wa) => wa.questionId === writtenAnswerResult.questionId
          )!.userAnswer,
        });
      } else {
        wrongAnswersCount++;
        checkedAnswers.splice(index!, 0, {
          ...question,
          wrongAnswer: writtenAnswers.find(
            (wa) => wa.questionId === writtenAnswerResult.questionId
          )!.userAnswer,
          correction: writtenAnswerResult.correction!,
          explanation: writtenAnswerResult.explenation!,
        });
      }
    }

    return successHandler({
      res,
      message: "Quiz answers checked successfully ✅",
    });
  };
}

export default QuizService;

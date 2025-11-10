import { ValidationException } from "../utils/exceptions/custom.exceptions.js";
const validationMiddleware = ({ schema }) => {
    return async (req, res, next) => {
        let validationErrorObject = {
            message: "",
            details: [],
        };
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const result = await schema[key].safeParseAsync(req[key]);
            if (!result.success) {
                validationErrorObject.details.push(...result.error.issues.map((issue) => {
                    validationErrorObject.message =
                        validationErrorObject.message.concat(!validationErrorObject.message.length
                            ? issue.message
                            : `.\n${issue.message}`);
                    return {
                        key,
                        path: issue.path.join(","),
                        message: issue.message,
                    };
                }));
            }
            else {
                if (!req.validationResult) {
                    req.validationResult = {};
                }
                Object.assign(req.validationResult, {
                    [key]: result.data,
                });
            }
        }
        console.log({ validationErrorObject });
        if (validationErrorObject.message.length > 0) {
            throw new ValidationException(validationErrorObject.message, validationErrorObject.details);
        }
        return next();
    };
};
export default validationMiddleware;

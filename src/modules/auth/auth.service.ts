import type { Request, Response } from "express";
import UserModel from "../../db/models/user.model.ts";
import UserRepository from "../../db/repositories/user.respository.ts";
import successHandler from "../../utils/handlers/success.handler.ts";

class AuthService {
  private _userRespository = new UserRepository(UserModel);

  signUp = async (req: Request, res: Response) => {
    console.log(this._userRespository);
    console.log(req.validationResult);
    
    
    return successHandler({ res });
  };
}

export default new AuthService();

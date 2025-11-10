import UserModel from "../../db/models/user.model.js";
import UserRepository from "../../db/repositories/user.respository.js";
import successHandler from "../../utils/handlers/success.handler.js";
class AuthService {
    _userRespository = new UserRepository(UserModel);
    signUp = async (req, res) => {
        console.log(this._userRespository);
        console.log(req.validationResult);
        return successHandler({ res });
    };
}
export default new AuthService();

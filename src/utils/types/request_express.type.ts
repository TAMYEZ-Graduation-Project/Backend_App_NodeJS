import type { HIUserType } from "../../db/interfaces/user.interface.ts";
import type { ITokenPayload } from "../constants/interface.constants.ts";
import type { RequestKeysType } from "./valdiation_schema.type.ts";

declare module "express-serve-static-core" {
  interface Request {
    user?: HIUserType;
    tokenPayload?: ITokenPayload;
    validationResult: Partial<Record<RequestKeysType, any>>;
  }
}

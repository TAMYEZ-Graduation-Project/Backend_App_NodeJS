import type { Model, ProjectionType, QueryOptions } from "mongoose";
import type { IUser as TDocument } from "../interfaces/user.interface.ts";
import DatabaseRepository from "./database.repository.ts";
import type { HydratedDocument } from "mongoose";

class UserRepository extends DatabaseRepository<TDocument> {
  constructor(model: Model<TDocument>) {
    super(model);
  }

  findByEmail = async ({
    email,
    projection,
    options,
  }: {
    email: string;
    projection?: ProjectionType<TDocument>;
    options?: QueryOptions<TDocument>;
  }): Promise<HydratedDocument<TDocument> | null> => {
    return this.model.findOne({ email }, projection, options);
  };
}
export default UserRepository;

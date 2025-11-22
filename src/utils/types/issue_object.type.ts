import type { RequestKeysType } from "./valdiation_schema.type.ts";

export type IssueObjectType = {
  key: RequestKeysType,
  path: string; //| number | symbol | undefined;
  message: string;
};

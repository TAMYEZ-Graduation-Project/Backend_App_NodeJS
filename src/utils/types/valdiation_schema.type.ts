import type { Request } from "express";
import type { ZodObject } from "zod";

export type RequestKeysType = keyof Request;
export type ZodSchemaType = Partial<Record<RequestKeysType, ZodObject>>;
import { type Request, type NextFunction, type Response } from "express";
import { type ErrorResponse } from "../schemas/error.schema";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";

// * Middleware for handling all the prisma known errors and validation errors
// * as a BadRequest
export function handlePrismaError(
  error: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
) {
  if (error instanceof PrismaClientKnownRequestError || error instanceof PrismaClientValidationError) {
    return res.status(400).json({
      message: error.message.replace(/(\r\n|\n|\r)/gm, ""),
      timestamp: new Date().toISOString(),
    });
  }

  return next(error);
}

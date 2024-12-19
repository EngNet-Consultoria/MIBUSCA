"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaError = handlePrismaError;
const library_1 = require("@prisma/client/runtime/library");
// * Middleware for handling all the prisma known errors and validation errors
// * as a BadRequest
function handlePrismaError(error, req, res, next) {
    if (error instanceof library_1.PrismaClientKnownRequestError || error instanceof library_1.PrismaClientValidationError) {
        return res.status(400).json({
            message: error.message.replace(/(\r\n|\n|\r)/gm, ""),
            timestamp: new Date().toISOString(),
        });
    }
    return next(error);
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = handleZodError;
const zod_1 = require("zod");
const zod_validation_error_1 = require("zod-validation-error");
function handleZodError(err, req, res, next) {
    if (err instanceof zod_1.z.ZodError) {
        return res.status(400).json({
            message: (0, zod_validation_error_1.fromZodError)(err).toString(),
            timestamp: new Date().toISOString(),
        });
    }
    return next(err);
}

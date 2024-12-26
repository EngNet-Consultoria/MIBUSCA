"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCommonError = handleCommonError;
const http_errors_1 = require("http-errors");
function handleCommonError(err, req, res, next) {
    if (err instanceof http_errors_1.HttpError) {
        return res.status(err.status).json({
            message: err.message,
            timestamp: new Date().toISOString(),
        });
    }
    return res.status(500).json({
        message: err.message,
        timestamp: new Date().toISOString(),
    });
}

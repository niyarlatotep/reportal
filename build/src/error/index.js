"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
class HttpError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
        this.message = message || http.STATUS_CODES[status] || "Error";
    }
}
exports.HttpError = HttpError;

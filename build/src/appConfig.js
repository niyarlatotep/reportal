"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const typeChecker = {
    isInt(value) {
        return Number.isInteger(value);
    },
    isString(value) {
        return typeof (value) === "string";
    },
    isBoolean(value) {
        return typeof (value) === "boolean";
    }
};
class AppConfig {
    get port() {
        if (typeChecker.isInt(this._port)) {
            return this._port;
        }
        throw new Error(`Type of port value is not a valid number`);
    }
    constructor() {
        this._port = config.get('app.port');
    }
}
class MongooseConfig {
    constructor() {
        this._reportal = config.get('reportal.uri');
        this._reports = config.get('reports.uri');
    }
    get reportal() {
        return this._reportal;
    }
    get reports() {
        return this._reports;
    }
}
class SessionConfig {
    constructor() {
        this._secret = config.get('session.secret');
    }
    get secret() {
        return this._secret;
    }
}
const appConfig = new AppConfig();
exports.appConfig = appConfig;
const mongooseConfig = new MongooseConfig();
exports.mongooseConfig = mongooseConfig;
const sessionConfig = new SessionConfig();
exports.sessionConfig = sessionConfig;

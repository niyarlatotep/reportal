"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const appConfig_1 = require("../appConfig");
class MongooseConnection {
    constructor() {
        this._reportal = mongoose.createConnection(appConfig_1.mongooseConfig.reportal, { useNewUrlParser: true, useCreateIndex: true });
    }
    get reportal() {
        return this._reportal;
    }
}
const mongooseConnection = new MongooseConnection();
exports.mongooseConnection = mongooseConnection;

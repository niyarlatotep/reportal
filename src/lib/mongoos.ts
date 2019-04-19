import * as mongoose from "mongoose";
import {mongooseConfig} from "../appConfig";

class MongooseConnection {
    private _reports = mongoose.createConnection(mongooseConfig.reports, { useNewUrlParser: true, useCreateIndex: true });
    private _reportal = mongoose.createConnection(mongooseConfig.reportal, { useNewUrlParser: true, useCreateIndex: true});
    get reports(){
        return this._reports;
    }
    get reportal(){
        return this._reportal
    }
}

const mongooseConnection = new MongooseConnection();

export {
    mongooseConnection
}
import mongoose from "mongoose";
import {mongooseConfig} from "../appConfig";

class MongooseConnection {
    private _reportal = mongoose.createConnection(mongooseConfig.reportal, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false});
    get reportal(){
        return this._reportal
    }
}

const mongooseConnection = new MongooseConnection();

export {
    mongooseConnection
}
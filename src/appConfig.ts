import * as config from "config";

const typeChecker = {
    isInt(value){
        return Number.isInteger(value)
    },
    isString(value){
        return typeof(value) === "string";
    },
    isBoolean(value){
        return typeof(value) === "boolean";
    }
};

class AppConfig {
    private _port: number;

    get port(){
        if (typeChecker.isInt(this._port)){
            return this._port;
        }
        console.log(this._port);
        throw new Error(`Type of port value is not a valid number`)
    }

    constructor(){
        this._port = config.get('app.port');
    }
}
class MongooseConfig {
    private _mongooseUri: string;

    constructor(){
        this._mongooseUri = config.get('mongoose.uri');
    }
    get mongooseUri(){
        return this._mongooseUri;
    }
}

const appConfig = new AppConfig();
const mongooseConfig = new MongooseConfig();

export {
    appConfig,
    mongooseConfig
}

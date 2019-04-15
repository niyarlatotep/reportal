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
    private _reportalUri = config.get<string>('reportal.uri');
    private _projectsReportsUri = config.get<string>('projectsReports.uri');

    get reportalUri(){
        return this._reportalUri;
    }
    get projectsReportsUri(){
        return this._projectsReportsUri;
    }
}
class SessionConfig {
    private _secret: string;

    constructor(){
        this._secret = config.get('session.secret');
    }
    get secret(){
        return this._secret;
    }
}

const appConfig = new AppConfig();
const mongooseConfig = new MongooseConfig();
const sessionConfig = new SessionConfig();

export {
    appConfig,
    mongooseConfig,
    sessionConfig
}

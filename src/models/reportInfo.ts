import {instanceMethod, prop, Typegoose, InstanceType, staticMethod, ModelType} from "typegoose";
import {mongooseConnection} from "../lib/mongoos";

class ReportInfo extends Typegoose {
    @prop({required: true, unique: true})
    launchId: string;

    @prop({required: true})
    projectId: string;


    @prop({required: true})
    launchDate: string;
}

const ReportInfoModel = new ReportInfo().getModelForClass(ReportInfo, {existingConnection: mongooseConnection.reportal});

export {
    ReportInfoModel
}
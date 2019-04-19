import {instanceMethod, prop, Typegoose, InstanceType, staticMethod, ModelType} from "typegoose";
import {mongooseConnection} from "../lib/mongoos";
import {UUID} from "../helpers/uuid";


class Report extends Typegoose {
    @prop({required: true, unique: true})
    name: string;

    @prop({required: true, unique: true, default: UUID()})
    id: string;
}

const ReportModel = new Report().getModelForClass(Report, {existingConnection: mongooseConnection.reportal});

export {
    ReportModel
}
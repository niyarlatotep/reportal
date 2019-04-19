import {instanceMethod, prop, Typegoose, InstanceType, staticMethod, ModelType} from "typegoose";
import {mongooseConnection} from "../lib/mongoos";
import {UUID} from "../helpers/uuid";


class Project extends Typegoose {
    @prop({required: true, unique: true})
    name: string;

    @prop({required: true, unique: true, default: UUID()})
    id: string;
}

const ProjectModel = new Project().getModelForClass(Project, {existingConnection: mongooseConnection.reportal});

export {
    ProjectModel
}
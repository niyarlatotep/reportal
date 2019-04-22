import {instanceMethod, prop, Typegoose, InstanceType, staticMethod, ModelType} from "typegoose";
import {mongooseConnection} from "../lib/mongoos";

class Project extends Typegoose {
    @prop({required: true, unique: true})
    name: string;

    @prop()
    description: string;
}

const ProjectModel = new Project().getModelForClass(Project, {existingConnection: mongooseConnection.reportal});

export {
    ProjectModel
}
import {instanceMethod, prop, Typegoose, InstanceType, staticMethod, ModelType} from "typegoose";
import {mongooseConnection} from "../lib/mongoos";

class Launch extends Typegoose {
    @prop({required: true, unique: true})
    launchId: string;

    @prop({required: true})
    projectId: string;


    @prop({required: true})
    launchDate: string;
}

const LaunchModel = new Launch().getModelForClass(Launch, {existingConnection: mongooseConnection.reportal});

export {
    LaunchModel,
    Launch
}
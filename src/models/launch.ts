import {instanceMethod, prop, Typegoose, InstanceType, staticMethod, ModelType} from "typegoose";
import {mongooseConnection} from "../lib/mongoos";

type ClientReport = {
    browserName: string;
    launchId: string;
    projectId: string;
    specId: string;
    id: string;
    description: string;
    fullName: string;
    failedExpectations: [{matcherName: string, message: string, stack: string, passed: boolean}];
    passedExpectations: [{matcherName: string, message: string, stack: string, passed: boolean}];
    pendingReason: string;
    utcStarted: string;
    suite: string;
    status: string;
    utcFinished: string;
    duration: number;
    browserVersion: string;
    platform: string;
    suiteDirectory: string;
}

type SpecReport = {
    specId: string;
    browsersResults: ClientReport[];
}

class Launch extends Typegoose {
    @prop({required: true, unique: true})
    launchId: string;

    @prop({required: true})
    projectId: string;

    @prop({required: true})
    launchDate: string;

    @prop({required: true})
    specsReports: SpecReport[];

    @prop({required: true, unique: true})
    browsers: string[];
}

const LaunchModel = new Launch().getModelForClass(Launch, {existingConnection: mongooseConnection.reportal});

export {
    LaunchModel,
    Launch,
    SpecReport,
    ClientReport
}
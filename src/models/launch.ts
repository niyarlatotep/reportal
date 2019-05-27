import {instanceMethod, prop, Typegoose, InstanceType, staticMethod, ModelType} from "typegoose";
import {mongooseConnection} from "../lib/mongoos";

type ClientReport = {
    browserName: string;
    launchName: string;
    projectId: string;
    specId: string;
    id: string;
    description: string;
    fullName: string;
    failedExpectations: [{matcherName: string, message: string, stack: string, passed: boolean}];
    passedExpectations: [{matcherName: string, message: string, stack: string, passed: boolean}];
    pendingReason: string;
    utcStarted: string | Date;
    suite: string;
    status: string;
    utcFinished: string;
    duration: number;
    browserVersion: string;
    platform: string;
}

type SpecReport = {
    [key: string]: ClientReport
} & {
    specName: string
}

class Launch extends Typegoose {
    @prop({required: true})
    launchName: string;

    @prop({required: true})
    projectId: string;

    @prop({required: true})
    launchDate: Date;

    @prop({required: true})
    specsReports: {[key: string]: SpecReport};

    @prop({required: true})
    browsers: string[];
}

const LaunchModel = new Launch().getModelForClass(Launch, {existingConnection: mongooseConnection.reportal});

export {
    LaunchModel,
    Launch,
    SpecReport,
    ClientReport
}
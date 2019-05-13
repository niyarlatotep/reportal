import {instanceMethod, prop, Typegoose, InstanceType, staticMethod, ModelType} from "typegoose";
import {mongooseConnection} from "../lib/mongoos";

interface SpecReport {
    launchId: string;
    projectId: string;
    specId: string
    id: string
    description: string
    fullName: string
    failedExpectations: [{matcherName: string, message: string, stack: string, passed: boolean}]
    passedExpectations: [{matcherName: string, message: string, stack: string, passed: boolean}]
    pendingReason: string
    utcStarted: string
    suite: string
    status: string
    utcFinished: string
    duration: number
    browserVersion: string
    platform: string
    browserName: string
    suiteDirectory: string
}

class Report extends Typegoose {
    @prop({required: true, unique: true})
    launchId: string;

    @prop({required: true})
    projectId: string;

    @prop({required: true})
    launchDate: string;

    @prop({required: true})
    specsReports: [SpecReport];

    @prop({required: true})
    specsIds: [string];

    @prop({required: true})
    browsers: [string];
}

const ReportModel = new Report().getModelForClass(Report, {existingConnection: mongooseConnection.reportal});

export {
    ReportModel,
    Report,
    SpecReport
}
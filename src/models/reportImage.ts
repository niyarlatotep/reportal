import {instanceMethod, prop, Typegoose, InstanceType, staticMethod, ModelType} from "typegoose";
import {mongooseConnection} from "../lib/mongoos";


class ReportImage extends Typegoose {
    @prop({required: true})
    img: InstanceType<Buffer>;

    @prop({required: true})
    launchName: string;

    @prop({required: true})
    projectId: string;


}

const ReportImageModel = new ReportImage().getModelForClass(ReportImage, {existingConnection: mongooseConnection.reportal});

export {
    ReportImageModel,
    ReportImage
}

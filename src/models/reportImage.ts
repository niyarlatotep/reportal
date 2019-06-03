import {instanceMethod, prop, Typegoose, InstanceType, staticMethod, ModelType} from "typegoose";
import {mongooseConnection} from "../lib/mongoos";


class ReportImage extends Typegoose {
    @prop({required: true})
    img: { data: Buffer, contentType: String }
}

const ReportImageModel = new ReportImage().getModelForClass(ReportImage, {existingConnection: mongooseConnection.reportal});

export {
    ReportImageModel
}

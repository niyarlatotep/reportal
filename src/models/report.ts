import * as mongoose from "mongoose";
import {mongooseConfig} from "../appConfig";

mongoose.connect(mongooseConfig.projectsReportsUri, { useNewUrlParser: true });
const ReportSchema = new mongoose.Schema({
    name: String
});

const ReportModel = mongoose.model('nsms', ReportSchema);

export {
    ReportModel
}
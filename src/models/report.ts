import * as mongoose from "mongoose";
import {mongooseConfig} from "../appConfig";

mongoose.connect(mongooseConfig.mongooseUri, { useNewUrlParser: true });
const CustomerSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    }
});

const CustomerModel = mongoose.model('123', CustomerSchema);

export {
    CustomerModel
}
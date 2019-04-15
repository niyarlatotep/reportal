import * as mongoose from "mongoose";
import {mongooseConfig} from "../appConfig";

export async function getProjectsNames(){
    mongoose.connect(mongooseConfig.projectsReportsUri, { useNewUrlParser: true, useCreateIndex: true });
    const connection = await mongoose.connection;
    console.log(await connection.db.listCollections({},{nameOnly: true}).toArray());
}
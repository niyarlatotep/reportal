import * as express from 'express';
import {LaunchModel} from "../models/launch";
import {Report, ReportModel} from "../models/report";
import {ProjectModel} from "../models/project";
import {Types} from "mongoose";

const reportRouter = express.Router();

reportRouter.get('/reports', async (req, res) => {
    //todo export method to ProjectModel class
    res.render('reports');
});

reportRouter.post('/report', async (req, res) => {
    if (!req.body){
        return res.status(400).send('Request body is missing');
    }
    const requestBody: Report = req.body;

    if (!Types.ObjectId.isValid(requestBody.projectId)){
        console.log('id is invalid');
        return res.sendStatus(400);
    }

    const project = await ProjectModel.findById(requestBody.projectId);
    if (!project){
        return res.sendStatus(404);
    }

    const launch = await LaunchModel.findOne({launchId: requestBody.launchId}).exec();
    if (!launch){
        const model = new LaunchModel({launchId: requestBody.launchId, projectId: requestBody.projectId,
            launchDate: requestBody.specData.utcStarted});
        try {
            await model.save();
            console.log(`New launch added: ${model}`);
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    }
    try {
        const model = new ReportModel(requestBody);
        await model.save();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

export {
    reportRouter
}
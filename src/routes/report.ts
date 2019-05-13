import * as express from 'express';
import {Report, ReportModel, SpecReport} from "../models/report";
import {ProjectModel} from "../models/project";
import {Types} from "mongoose";

const reportRouter = express.Router();

reportRouter.get('/report/:launchId', async (req, res) => {
    const launch = await ReportModel.findById(req.params.launchId);
    
    res.render('reports', {launch: {browsers: launch.browsers}});
});

reportRouter.post('/report', async (req, res) => {
    if (!req.body){
        return res.status(400).send('Request body is missing');
    }
    const requestBody: SpecReport = req.body;

    if (!Types.ObjectId.isValid(requestBody.projectId)){
        console.log('id is invalid');
        return res.sendStatus(400);
    }

    const project = await ProjectModel.findById(requestBody.projectId);
    if (!project){
        return res.sendStatus(404);
    }

    const launch = await ReportModel.findOne({launchId: requestBody.launchId}).exec();
    if (!launch){
        const model = new ReportModel({
            launchId: requestBody.launchId,
            projectId: requestBody.projectId,
            launchDate: requestBody.utcStarted,
            specsReports: [requestBody],
            specsIds: [requestBody.specId],
            browsers: [requestBody.browserName]
        });
        try {
            await model.save();
            console.log(`New launch added: ${model}`);
            res.sendStatus(200);
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    } else {
        launch.specsReports.push(requestBody);
        launch.markModified('specsReports');
        if (!launch.specsIds.includes(requestBody.specId)){
            launch.specsIds.push(requestBody.specId);
            launch.markModified('specsIds');
        }
        if (!launch.browsers.includes(requestBody.browserName)){
            launch.browsers.push(requestBody.browserName);
            launch.browsers.sort();
            launch.markModified('browsers');
        }
        try {
            await launch.save();
            res.sendStatus(200);
            console.log(`New spec results added`);
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    }

    // for (let specId of launch.specsIds){
    //     let currentSpecs = launch.specsReports.filter(report => report.specId === specId);
    //     console.log(currentSpecs);
    // }
});

export {
    reportRouter
}
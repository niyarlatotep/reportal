import * as express from 'express';
import {ClientReport, Launch, LaunchModel, SpecReport} from "../models/launch";
import {ProjectModel} from "../models/project";
import {Types} from "mongoose";

const reportRouter = express.Router();

reportRouter.get('/report/:launchId', async (req, res) => {
    const launch = <Launch>await LaunchModel.findById(req.params.launchId);
    const resultsSorted: {specId: string, browsersResults: (ClientReport | string)[]}[] = [];
    for (const specReport in launch.specsReports){
        console.log(resultsSorted);
        let sortedBrowserResults: (ClientReport | string)[] = [];
        for (const browser of launch.browsers){
            sortedBrowserResults.push(launch.specsReports[specReport][browser] || '')
        }
        resultsSorted.push({specId: specReport, browsersResults: sortedBrowserResults});
    }
    res.render('reports', {launch: {browsers: launch.browsers, specsReports: resultsSorted}});
});

reportRouter.post('/report', async (req, res) =>{
    if (!req.body){
        return res.status(400).send('Request body is missing');
    }
    const requestBody: ClientReport = req.body;
    requestBody.utcStarted = new Date(requestBody.utcStarted);


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
        const model = new LaunchModel({
            launchId: requestBody.launchId,
            projectId: requestBody.projectId,
            launchDate: requestBody.utcStarted,
            specsReports: {[requestBody.specId]: {[requestBody.browserName]: requestBody}},
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
        if (launch.specsReports[requestBody.specId]){
            //if report exists
            if (launch.specsReports[requestBody.specId][requestBody.browserName]){
                //if such browser exists yet can't be duple
                res.status(500).json('Browser name duplicate');
                throw new Error('Browser name duplicate');
            }
            launch.specsReports[requestBody.specId][requestBody.browserName] = requestBody;
        } else {
            launch.specsReports[requestBody.specId] = {[requestBody.browserName]: requestBody};
        }
        launch.markModified('specsReports');

        if (!launch.browsers.includes(requestBody.browserName)){
            launch.browsers.push(requestBody.browserName);
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
});

export {
    reportRouter
}
import * as express from 'express';
import {ClientReport, Launch, LaunchModel, SpecReport} from "../models/launch";
import {ProjectModel} from "../models/project";
import {Types} from "mongoose";
import {subscribes} from "./subscribes";
import {projectRouter} from "./project";

const reportRouter = express.Router();

reportRouter.get('/report/:launchId', async (req, res) =>{
    //todo add try catch
    const launch = await LaunchModel.findById(req.params.launchId).exec();
    const resultsSorted: {specName: string, launchName: string, specId: string, browsersResults: (ClientReport | string)[]}[] = [];
    for (const specReport in launch.specsReports){
        let sortedBrowserResults: (ClientReport | string)[] = [];
        for (const browser of launch.browsers){
            if (launch.specsReports[specReport][browser]){
                launch.specsReports[specReport][browser].duration = Math.round(launch.specsReports[specReport][browser].duration);
                sortedBrowserResults.push(launch.specsReports[specReport][browser])
            } else {
                sortedBrowserResults.push('')
            }
        }
        resultsSorted.push({specName: launch.specsReports[specReport].specName, launchName: launch.launchName, specId: specReport, browsersResults: sortedBrowserResults});
    }
    res.render('reports', {launch: { launchName: launch.launchName,
            browsers: launch.browsers, specsReports: resultsSorted, projectId: launch.projectId, launchId: launch._id}});
});

reportRouter.get('/report-update/:launchId', async (req, res) =>{
    console.log(req.params.launchId);
    subscribes.subscribe(res, req.params.launchId);
});

reportRouter.get('/launches-update/:projectId', async (req, res) =>{
    subscribes.subscribe(res, req.params.projectId);
});

projectRouter.delete('/launch/:launchId', async (req, res) => {
    await LaunchModel.findByIdAndDelete(req.params.launchId).exec();
    res.sendStatus(200);
});

reportRouter.post('/report', async (req, res) =>{
    const requestBody: ClientReport = req.body;
    if (!req.body){
        return res.status(400).send('Request body is missing');
    }

    if (!Types.ObjectId.isValid(requestBody.projectId)){
        console.log('id is invalid');
        return res.sendStatus(400);
    }

    try {
        const updateResult = await LaunchModel.findOneAndUpdate({projectId: requestBody.projectId, launchName: requestBody.launchName},
            {
                $setOnInsert: {
                    launchDate: new Date(requestBody.utcStarted),
                    projectId: requestBody.projectId,
                    launchName: requestBody.launchName
                },
                [`specsReports.${requestBody.specId}.${requestBody.browserName}`]: requestBody,
                [`specsReports.${requestBody.specId}.specName`]: requestBody.description,
                $addToSet: {browsers: requestBody.browserName}
            },
            {upsert: true, rawResult: true}).exec();
        if (updateResult){
            //if fields updated
            subscribes.publish(updateResult.value._id);
        } else {
            //if new launch added (new document)
            subscribes.publish(requestBody.projectId);
        }
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res.status(500).json(e);
    }
});

export {
    reportRouter
}
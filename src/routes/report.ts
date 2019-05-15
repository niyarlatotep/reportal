import * as express from 'express';
import {ClientReport, Launch, LaunchModel, SpecReport} from "../models/launch";
import {ProjectModel} from "../models/project";
import {Types} from "mongoose";

const reportRouter = express.Router();

reportRouter.get('/report/:launchId', async (req, res) => {
    const launch = <Launch>await LaunchModel.findById(req.params.launchId);
    
    for (const specReport of launch.specsReports){
        let sortedBrowserResults = [];
        for (const browser of launch.browsers){
            const browserResult = specReport.browsersResults.filter(browserResult => browserResult.browserName === browser);
            if (browserResult.length){
                sortedBrowserResults = sortedBrowserResults.concat(browserResult)
            } else {
                sortedBrowserResults.push('')
            }
        }
        specReport.browsersResults = sortedBrowserResults;
    }

    res.render('reports', {launch: {browsers: launch.browsers, specsReports: launch.specsReports}});
});

reportRouter.post('/report', async (req, res) =>{
    if (!req.body){
        return res.status(400).send('Request body is missing');
    }
    const requestBody: ClientReport = req.body;

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
            specsReports: [{specId: requestBody.specId, browsersResults: [requestBody]}],
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
        function addReportToExistingLaunch(){
            for (let report of launch.specsReports){
                if (report.specId === requestBody.specId){
                    //todo check browsers unique
                    if (report.browsersResults.some(browserResult => browserResult.browserName === requestBody.browserName)){
                        res.status(500).json('Browser name duplicate');
                        throw new Error('Browser name duplicate');
                    }
                    report.browsersResults.push(requestBody);
                    launch.markModified('specsReports');
                    return;
                }
            }
            launch.specsReports.push({specId: requestBody.specId, browsersResults: [requestBody]});
            launch.markModified('specsReports');
        }

        addReportToExistingLaunch();
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
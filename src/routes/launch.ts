import * as express from 'express';
import {ClientReport, LaunchModel} from "../models/launch";
import {subscribes} from "../lib/subscribes";
import {projectRouter} from "./project";

const launchRouter = express.Router();

launchRouter.get('/launch/:launchId', async (req, res) =>{
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
    res.render('reports', {reports: { launchName: launch.launchName,
            browsers: launch.browsers, specsReports: resultsSorted, projectId: launch.projectId, launchId: launch._id}});
});

projectRouter.delete('/launch/:launchId', async (req, res) => {
    await LaunchModel.findByIdAndDelete(req.params.launchId).exec();
    res.sendStatus(200);
});

launchRouter.get('/launches-update/:projectId', async (req, res) =>{
    console.log('subscribe to launches', req.params.projectId)
    subscribes.subscribe(res, req.params.projectId);
});

export {
    launchRouter
}
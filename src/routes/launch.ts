import express from 'express';
import {ClientReport, LaunchModel} from "../models/launch";
import {subscribes} from "../lib/subscribes";
import {projectRouter} from "./project";
import {ReportImageModel} from "../models/reportImage";
import {authorizationCheck, isAdmin, onlyAdminAllowed} from "../lib/authorizationCheck";

const launchRouter = express.Router();

launchRouter.get('/launch/:launchId', authorizationCheck, async (req, res) =>{
    //todo add try catch
    let browsersInfo: {browserName: string, browserVersion: string}[] = [];
    const launch = await LaunchModel.findById(req.params.launchId).exec();
    const resultsSorted: {specName: string, launchName: string, specId: string, browsersResults: (ClientReport | string)[]}[] = [];
    for (const specReport in launch.specsReports){
        let sortedBrowserResults: (ClientReport | string)[] = [];
        for (const browser of launch.browsers){
            if (browsersInfo.length < launch.browsers.length){
                browsersInfo.push({browserName: browser, browserVersion: launch.specsReports[specReport][browser].browserVersion});
            }
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
            browsers: browsersInfo, specsReports: resultsSorted, projectId: launch.projectId, launchId: launch._id}, isAdmin: isAdmin(req)});
});

projectRouter.delete('/launch/:launchId', onlyAdminAllowed, async (req, res) => {
    const launch = await LaunchModel.findByIdAndDelete(req.params.launchId).exec();
    await ReportImageModel.deleteMany({launchName: launch.launchName});
    subscribes.publish('projects');
    subscribes.publish(launch.projectId);
    res.sendStatus(200);
});

launchRouter.get('/launches-update/:projectId', authorizationCheck, async (req, res) =>{
    console.log('subscribe to launches', req.params.projectId);
    subscribes.subscribe(res, req.params.projectId);
});

export {
    launchRouter
}
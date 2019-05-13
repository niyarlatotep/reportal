import * as express from 'express';
import {ProjectModel} from "../models/project";
import {Report, ReportModel} from "../models/report";

const projectRouter = express.Router();

projectRouter.get('/projects', async (req, res) => {
    const projects = await ProjectModel.find({}).exec();
    res.render('projects', {projects: {list:  projects}});
});

projectRouter.post('/project', async (req, res) => {
    if (!req.body){
        return res.status(400).send('Request body is missing');
    }
    console.log(req.body);
    const model = new ProjectModel(req.body);
    console.log(model);
    try {
        const doc = await model.save();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

projectRouter.get('/project/:projectId', async (req, res) => {
    const launches: Report[] = await ReportModel.find({projectId: req.params.projectId});
    launches.sort((a, b)=>{
        return +new Date(a.launchDate) - +new Date(b.launchDate)
    });
    launches.reverse();

    //todo move to date converter
    launches.forEach(launch =>{
        const dateFormat = new Date(launch.launchDate);
        const dateString =  dateFormat.toLocaleDateString()
            .split('-')
            .reverse()
            .map(str=>{
                return str.padStart(2, '0');
            })
            .join('.');

        const timeString = dateFormat.toLocaleTimeString();

        launch.launchDate = [dateString, timeString].join(' ');
    });
    //todo move to reports
    res.render('launches', {launches: {list:  launches, projectId: req.params.projectId}});
});

export {
    projectRouter
}
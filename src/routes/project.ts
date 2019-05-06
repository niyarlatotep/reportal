import * as express from 'express';
import {ProjectModel} from "../models/project";
import {LaunchModel} from "../models/launch";

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
    const launches = await LaunchModel.find({projectId: req.params.projectId});
    console.log(launches);
    res.render('reports', {reports: {list:  launches, projectId: req.params.projectId}});
});

export {
    projectRouter
}
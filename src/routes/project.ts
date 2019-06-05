import express from 'express';
import {ProjectModel} from "../models/project";
import {Launch, LaunchModel} from "../models/launch";
import {ReportImageModel} from "../models/reportImage";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

const projectRouter = express.Router();

// _id
// name
// lastLaunchDateAgo

projectRouter.get('/projects', async (req, res) => {
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo('en-US');

    const projects = await ProjectModel.find({}).exec();
    const localProjects = projects.map(project =>{
        return {
            _id: project._id,
            name: project.name,
            lastLaunchDateAgo: project.lastLaunchDate && timeAgo.format(project.lastLaunchDate.getTime())
        }
    });

    res.render('projects', {projects: {list:  localProjects}});
});

projectRouter.post('/project', async (req, res)=>{
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

projectRouter.delete('/project/:projectId', async (req, res) => {
    await Promise.all([
        LaunchModel.deleteMany({projectId: req.params.projectId}).exec(),
        ProjectModel.findByIdAndDelete(req.params.projectId).exec(),
        ReportImageModel.deleteMany({projectId: req.params.projectId})
    ]);
    res.sendStatus(200);
});

projectRouter.get('/project/:projectId', async (req, res) => {
    const launches = await LaunchModel.find({projectId: req.params.projectId}).sort({launchDate: -1}).exec();
    const project = await ProjectModel.findById(req.params.projectId).exec();

    const localLaunches = launches.map(launch =>{
        const dateString =  launch.launchDate.toLocaleDateString()
            .split('-')
            .reverse()
            .map(str=>{
                return str.padStart(2, '0');
            })
            .join('.');
        const timeString = launch.launchDate.toLocaleTimeString();

        return {
            _id : launch._id,
            launchName: launch.launchName,
            launchDateLocal: [dateString, timeString].join(' ')
        };
    });

    res.render('launches', {launches: {list:  localLaunches, projectId: req.params.projectId, projectName: project.name}});
});

export {
    projectRouter
}
import * as express from 'express';
import * as path from "path";
import {ProjectModel} from "../models/project";

const projectRouter = express.Router();

projectRouter.get('/projects', async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/projects.html'));
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

export {
    projectRouter
}
import {UserAccountModel, IUserAccountDocument} from "../models/userAccount";
import * as express from 'express';
import * as path from "path";

const projectsRouter = express.Router();

projectsRouter.get('/projects', async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/projects.html'));
});

export {
    projectsRouter
}
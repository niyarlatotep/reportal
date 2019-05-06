import * as express from 'express';
import * as path from "path";
import {ProjectModel} from "../models/project";

const mainRouter = express.Router();

mainRouter.get('/', async (req, res, next) => {
    if (!req.session.user){
        res.sendFile(path.join(__dirname, '../public/signin.html'));
    } else {
        res.redirect('/projects')
    }
});

export {
    mainRouter
}
import express from 'express';
import path from "path";

const mainRouter = express.Router();

mainRouter.get('/', async (req, res, next) => {
    if (!req.session.user){
        res.sendFile(path.join(req.app.get('rootDirectory'), 'src', 'public/signin.html'));
    } else {
        res.redirect('/projects')
    }
});

export {
    mainRouter
}
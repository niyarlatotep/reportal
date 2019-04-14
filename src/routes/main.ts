import * as express from 'express';
import * as path from "path";

const mainRouter = express.Router();

mainRouter.get('/', async (req, res, next) => {
    if (!req.session.user){
        res.sendFile(path.join(__dirname, '../public/login.html'));
    } else {
        console.log(req.session.user);
        res.sendFile(path.join(__dirname, '../public/loged.html'));
    }
});

export {
    mainRouter
}
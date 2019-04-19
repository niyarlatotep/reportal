import {UserAccountModel} from "../models/userAccount";
import * as express from 'express';

const loginRouter = express.Router();

loginRouter.post('/login', async (req, res) => {
    const userName = req.body.name;
    const password = req.body.password;
    try {
        const currentUserAccount = await UserAccountModel.authorize(userName, password);
        if (currentUserAccount){
            console.log(currentUserAccount);
            console.log('login correct');
            req.session.user = currentUserAccount;
            res.send();
        } else {
            console.log('login incorrect');
            res.status(403).send();
        }
    } catch (e) {
        console.error(e)
    }


});

export {
    loginRouter
}
import {UserAccountModel} from "../models/userAccount";
import * as express from 'express';

const loginRouter = express.Router();

loginRouter.post('/login', async (req, res) => {
    const userName = req.body.name;
    const password = req.body.password;

    const currentAdmin = await UserAccountModel.findOne({userName: userName});

    if (currentAdmin){
        console.log(currentAdmin);
        if (currentAdmin.checkPassword(password)){
            console.log('password correct')
        }
        res.end();
    } else {
        res.status(401).send();
    }
});

export {
    loginRouter
}
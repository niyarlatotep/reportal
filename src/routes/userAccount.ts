import {UserAccountModel} from "../models/userAccount";
import * as express from 'express';

const userAccountRouter = express.Router();

userAccountRouter.post('/userAccount', async (req, res) => {
    if (!req.body){
        return res.status(400).send('Request body is missing');
    }
    const model = new UserAccountModel(req.body);
    try {
        const doc = await model.save();
        res.status(201).send(doc);
    } catch (err) {
        res.status(500).json(err);
    }
});

userAccountRouter.put('/userAccount', async (req, res)=>{
    if(!req.query.email){
        return res.status(400).send('Missing URL parameter: email')
    }

    try {
        const doc = await UserAccountModel.findOneAndUpdate({
            name: req.query.name
        }, req.body, {
            new: true
        });
        res.send(200)
    } catch (e) {
        res.status(500).json
    }
});

userAccountRouter.delete('/userAccount', async (req, res)=>{
    if(!req.query.name){
        return res.status(400).send('Missing URL parameter: email')
    }

    try {
        const doc = await UserAccountModel.findOneAndRemove({
            name: req.query.name
        });
        res.json(doc)
    } catch (e) {
        res.status(500).json
    }
});

export {
    userAccountRouter
}
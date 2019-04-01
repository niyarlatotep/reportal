import {CustomerModel} from "../models/customer";
import * as express from 'express';

const customerRouter = express.Router();

customerRouter.post('/customer', async (req, res) => {
    if (!req.body){
        return res.status(400).send('Request body is missing');
    }
    // let user = {
    //     name: 'firstname lastname',
    //     email: 'email@gmail.com'
    // };
    const model = new CustomerModel(req.body);
    try {
        const doc = await model.save();
        res.status(201).send(doc);
    } catch (err) {
        res.status(500).json(err);
    }
});

customerRouter.get('/customer', async (req, res)=>{
    if(!req.query.email){
        return res.status(400).send('Missing URL parameter: email')
    }

    try {
        const doc = await CustomerModel.findOne({
            email: req.query.email
        });
        res.json(doc)
    } catch (e) {
        res.status(500).json
    }
});

customerRouter.put('/customer', async (req, res)=>{
    if(!req.query.email){
        return res.status(400).send('Missing URL parameter: email')
    }

    try {
        const doc = await CustomerModel.findOneAndUpdate({
            email: req.query.email
        }, req.body, {
            new: true
        });
        res.json(doc)
    } catch (e) {
        res.status(500).json
    }
});

customerRouter.delete('/customer', async (req, res)=>{
    if(!req.query.email){
        return res.status(400).send('Missing URL parameter: email')
    }

    try {
        const doc = await CustomerModel.findOneAndRemove({
            email: req.query.email
        });
        res.json(doc)
    } catch (e) {
        res.status(500).json
    }
});

export {
    customerRouter
}
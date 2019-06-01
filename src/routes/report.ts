import * as express from 'express';
import {ClientReport, LaunchModel} from "../models/launch";
import {Types, Mongoose} from "mongoose";
import {subscribes} from "../lib/subscribes";
import * as formidableMiddleware from "express-formidable";
import {promises} from "fs";

const reportRouter = express.Router();


reportRouter.get('/reports-update/:launchId', async (req, res) =>{
    // console.log('subscribe to reports', req.params.launchId)
    subscribes.subscribe(res, req.params.launchId);
});

reportRouter.post('/report', async (req, res) =>{
    const requestBody: ClientReport = req.body;
    if (!req.body){
        return res.status(400).send('Request body is missing');
    }

    if (!Types.ObjectId.isValid(requestBody.projectId)){
        console.log('id is invalid');
        return res.sendStatus(400);
    }

    try {               
        const updateResult = await LaunchModel.findOneAndUpdate({projectId: requestBody.projectId, launchName: requestBody.launchName},
            {
                $setOnInsert: {
                    launchDate: new Date(requestBody.utcStarted),
                    projectId: requestBody.projectId,
                    launchName: requestBody.launchName                    
                },            
                [`specsReports.${requestBody.specId}.${requestBody.browserName}`]: requestBody,            
                [`specsReports.${requestBody.specId}.specName`]: requestBody.description,
                $addToSet: {browsers: requestBody.browserName}
            },
            {upsert: true, rawResult: true}).exec();
        if (updateResult){
            //if fields updated
            console.log('fields updates', updateResult.value._id)
            subscribes.publish(updateResult.value._id);
        } else {
            //if new launch added (new document)
            console.log('new launch update', requestBody.projectId)
            subscribes.publish(requestBody.projectId);
        }
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res.status(500).json(e);
    }
});

reportRouter.get('/report/:projectId/:launchId/:specId/:browserName', async (req, res) =>{
    const launch = await LaunchModel.findOne({_id: req.params.launchId, projectId: req.params.projectId});
    res.render('fails', {fails: {failedExpectations: launch.specsReports[req.params.specId][req.params.browserName].failedExpectations, projectId: launch.projectId,
        launchId: launch._id, specName: launch.specsReports[req.params.specId][req.params.browserName].description}});
});
// reportRouter.use(formidableMiddleware());

reportRouter.post('/report-screen', formidableMiddleware(), async (req, res)=>{
    console.log('lsjdflksjflksdjflksdfjl')
    // console.log(req)
    console.log(req.fields)
    console.log(req.files)
    await promises.writeFile('C:/testScreen/testScreen.png', req.fields.screen, 'base64')

});

export {
    reportRouter
}
import * as express from 'express';
import {ClientReport, LaunchModel} from "../models/launch";
import {Types, Mongoose} from "mongoose";
import {subscribes} from "../lib/subscribes";
import * as formidableMiddleware from "express-formidable";
import {promises} from "fs";
import { ReportImageModel } from '../models/reportImage';
import {ProjectModel} from "../models/project";

const reportRouter = express.Router();


reportRouter.get('/reports-update/:launchId', async (req, res) =>{
    console.log('subscribe to reports', req.params.launchId)
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

    const project = await ProjectModel.findById(requestBody.projectId);
    if(!project){
        return res.sendStatus(404).json(`Project doesn't exist`);
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
            console.log('fields updates', updateResult.value._id);
            subscribes.publish(updateResult.value._id);
        } else {
            //if new launch added (new document)
            console.log('new launch update', requestBody.projectId);
            subscribes.publish(requestBody.projectId);
        }
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        return res.status(500).json(e);
    }
});

//todo move to fails and passes route
reportRouter.get('/fails/:projectId/:launchId/:specId/:browserName', async (req, res) =>{
    const launch = await LaunchModel.findOne({_id: req.params.launchId, projectId: req.params.projectId});
    res.render('fails', {fails: {failedExpectations: launch.specsReports[req.params.specId][req.params.browserName].failedExpectations, projectId: launch.projectId,
            launchId: launch._id, specName: launch.specsReports[req.params.specId][req.params.browserName].description, screenId: launch.specsReports[req.params.specId][req.params.browserName].screenId}});
});

reportRouter.get('/passes/:projectId/:launchId/:specId/:browserName', async (req, res) =>{
    const launch = await LaunchModel.findOne({_id: req.params.launchId, projectId: req.params.projectId});
    res.render('passes', {passes: {screenId: launch.specsReports[req.params.specId][req.params.browserName].screenId, specName: launch.specsReports[req.params.specId][req.params.browserName].description,
            projectId: launch.projectId, launchId: launch._id}});
});

reportRouter.post('/report-screen', formidableMiddleware(), async (req, res)=>{
    if (!Types.ObjectId.isValid(<string>req.fields.projectId)){
        console.log('id is invalid');
        return res.sendStatus(400);
    }
    const project = await ProjectModel.findById(req.fields.projectId);
    if(!project){
        return res.sendStatus(404).json(`Project doesn't exist`);
    }

    const reportImage = new ReportImageModel({_id: req.fields.screenId, launchName: req.fields.launchName,
        projectId: req.fields.projectId, img: Buffer.from(<string>req.fields.screen, 'base64')});

    try{
        await reportImage.save();
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

reportRouter.get('/report-screen/:screenId', async (req, res)=>{
    const reportImage = await ReportImageModel.findById(req.params.screenId);
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': reportImage.img.buffer.byteLength
    });
    res.end(reportImage.img.buffer);
});

export {
    reportRouter
}
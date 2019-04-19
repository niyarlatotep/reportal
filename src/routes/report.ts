// import {CustomerModel} from "../models/customer";
// import * as express from 'express';
//
// const reportRouter = express.Router();
//
// reportRouter.post('/report/:projectId/:runId', async (req, res) =>{
//     console.log(req.params);
//     console.log(req.params.runId);
//     if (!req.body){
//         return res.status(400).send('Request body is missing');
//     }
//     res.end();
//     // let user = {
//     //     name: 'firstname lastname',
//     //     email: 'email@gmail.com'
//     // };
//     const model = new CustomerModel(req.body);
//     try {
//         const doc = await model.save();
//         res.status(201).send(doc);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });
//
// reportRouter.get('/report/:runId', async (req, res)=>{
//     if(!req.query.email){
//         return res.status(400).send('Missing URL parameter: email')
//     }
//
//     try {
//         const doc = await CustomerModel.findOne({
//             email: req.query.email
//         });
//         res.json(doc)
//     } catch (e) {
//         res.status(500).json
//     }
// });
//
// reportRouter.delete('/report/:runId', async (req, res)=>{
//     if(!req.query.email){
//         return res.status(400).send('Missing URL parameter: email')
//     }
//
//     try {
//         const doc = await CustomerModel.findOneAndRemove({
//             email: req.query.email
//         });
//         res.json(doc)
//     } catch (e) {
//         res.status(500).json
//     }
// });
//
// export {
//     reportRouter
// }
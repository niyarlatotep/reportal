import * as express from 'express';
const personRouter = express.Router();

personRouter.get('/person', (req, res)=>{
    res.send('You have requested a person');
});

personRouter.get('/person/:name', (req, res)=>{
    res.send(`You have requested a person ${req.params.name}`);
});

export {
    personRouter
}
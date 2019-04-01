import * as express from 'express';
import * as bodyParser from 'body-parser';
import {appConfig} from "./appConfig";
import {personRouter} from "./routes/person";
import {customerRouter} from "./routes/customer";

const app = express();
app.use(bodyParser.json());

app.use((req, res, next)=>{
    console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
    next()
});
app.use(personRouter);
app.use(customerRouter);
app.use(userAccount);
app.use(express.static('public'));
app.use((req, res, next)=>{
    res.status(404).send('Path doesnt exist')
});
app.use((err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).send('Server error');

});

app.listen(appConfig.port, ()=> console.log(`Server has started on ${appConfig.port}`));
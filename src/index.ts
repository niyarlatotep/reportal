import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as connectMongo from 'connect-mongo'
import * as mongoose from "mongoose";

import {appConfig, mongooseConfig, sessionConfig} from "./appConfig";
import {personRouter} from "./routes/person";
import {customerRouter} from "./routes/customer";
import {userAccountRouter} from "./routes/userAccount";
import * as path from "path";

const app = express();
//todo make mongoose connectin helper
mongoose.connect(mongooseConfig.mongooseUri, { useNewUrlParser: true, useCreateIndex: true });

app.use(bodyParser.json());
app.use(cookieParser());
const MongoStore = connectMongo(session);
app.use(session({secret: sessionConfig.secret,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    resave: true,
    saveUninitialized: true
}));

app.use((req, res, next)=>{
    console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
    next()
});
app.use(personRouter);
app.use(customerRouter);
app.use(userAccountRouter);
app.post('/login', function (req, res) {
    res.end();
});
app.get('/loged', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/loged.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    res.status(404).send('Path doesnt exist')
});
app.use((err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).send('Server error');

});

app.listen(appConfig.port, ()=> console.log(`Server has started on ${appConfig.port}`));
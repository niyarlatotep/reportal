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
import {UserAccountModel} from "./models/userAccount";
import {loginRouter} from "./routes/login";
import {mainRouter} from "./routes/main";

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
app.use(mainRouter);
app.use(personRouter);
app.use(customerRouter);
app.use(userAccountRouter);
app.use(loginRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/loged', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/loged.html'));
    // res.sendFile(path.join(__dirname, '/public/loged.html'));
});

app.use((req, res, next)=>{
    res.status(404).send('Path doesnt exist')
});
app.use((err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).send('Server error');
});

async function appInit() {
    const Admin = await UserAccountModel.findOne({userName: 'admin'});
    if (!Admin){
        console.log('Admin account creating');
        const newAdmin = new UserAccountModel({userName: 'admin', password: 'admin'});
        await newAdmin.save();
        console.log('Admin account created');
        console.log('Guest account creating');
        const guest = new UserAccountModel({userName: 'guest', password: 'guest'});
        await guest.save();
        console.log('Admin account created');
    }
    app.listen(appConfig.port, ()=> console.log(`Server has started on ${appConfig.port}`));
}

appInit();

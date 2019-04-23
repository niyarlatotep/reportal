import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as connectMongo from 'connect-mongo'
import * as path from "path";
import * as exhbs from 'express-handlebars';

import {appConfig, sessionConfig} from "./appConfig";
import {personRouter} from "./routes/person";
import {userAccountRouter} from "./routes/userAccount";
import {UserAccountModel} from "./models/userAccount";
import {loginRouter} from "./routes/login";
import {mainRouter} from "./routes/main";
import {projectRouter} from "./routes/project";
import {logoutRouter} from "./routes/logout";
import {mongooseConnection} from "./lib/mongoos";

const app = express();
//todo make mongoose connectin helper
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exhbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(cookieParser());
const MongoStore = connectMongo(session);
app.use(session({secret: sessionConfig.secret,
    store: new MongoStore({mongooseConnection: mongooseConnection.reportal}),
    resave: true,
    saveUninitialized: true
}));

app.get('/about', (req, res)=>{
    res.render('index')
});

app.use((req, res, next)=>{
    // console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
    next()
});

app.use(mainRouter);
// app.use(reportRouter);
app.use(personRouter);
app.use(userAccountRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(projectRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    res.status(404).send('Path doesnt exist')
});
app.use((err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).send('Server error');
});

async function appInit() {
    //
    // const Admin = await UserAccountModel.findOne({name: 'admin'}).exec();
    //
    // if (!Admin){
    //     console.log('Admin account creating');
    //     const newAdmin = new UserAccountModel({name: 'admin', password: 'admin'});
    //     await newAdmin.save();
    //     console.log('Admin account created');
    //     console.log('Guest account creating');
    //     const guest = new UserAccountModel({name: 'guest', password: 'guest'});
    //     await guest.save();
    //     console.log('Guest account created');
    // }
    app.listen(appConfig.port, ()=> console.log(`Server has started on ${appConfig.port}`));
}

appInit();

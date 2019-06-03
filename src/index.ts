import 'source-map-support/register'
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as connectMongo from 'connect-mongo'
import * as path from "path";
import * as exhbs from 'express-handlebars';

import {appConfig, sessionConfig} from "./appConfig";
import {userAccountRouter} from "./routes/userAccount";
import {UserAccountModel} from "./models/userAccount";
import {loginRouter} from "./routes/login";
import {mainRouter} from "./routes/main";
import {projectRouter} from "./routes/project";
import {logoutRouter} from "./routes/logout";
import {mongooseConnection} from "./lib/mongoos";
import {reportRouter} from "./routes/report";
import {launchRouter} from "./routes/launch";

const app = express();
//todo make mongoose connectin helper
function isEqualHelperHandlerbar(a, b, opts) {
    if (a == b) {
        return opts.fn(this)
    } else {
        return opts.inverse(this)
    }
}
app.set('rootDirectory', path.join(__dirname, '..'));
app.set('views', path.join('src','views'));
app.engine('handlebars', exhbs({defaultLayout: 'main', helpers : {
        if_equal : isEqualHelperHandlerbar
    }}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(cookieParser());
const MongoStore = connectMongo(session);
app.use(session({secret: sessionConfig.secret,
    store: new MongoStore({mongooseConnection: mongooseConnection.reportal}),
    resave: true,
    saveUninitialized: true
}));

app.use(loginRouter);
app.use(logoutRouter);
app.use(mainRouter);
app.use(projectRouter);
app.use(launchRouter);
app.use(reportRouter);
app.use(userAccountRouter);
app.use(express.static(path.join(app.get('rootDirectory'), 'src', 'public')));

app.use((req, res, next)=>{
    res.status(404).send('Path doesnt exist')
});
app.use((err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).send('Server error');
});

function appInit() {
    //todo add error catch
    UserAccountModel.findOneAndUpdate({name: 'admin'},
        { $setOnInsert: new UserAccountModel({name: 'admin', password: 'admin'})}, {upsert: true}).exec()
        .catch(error => console.error(error));

    UserAccountModel.findOneAndUpdate({name: 'guest'},
        { $setOnInsert: new UserAccountModel({name: 'guest', password: 'guest'})}, {upsert: true}).exec()
        .catch(error => console.error(error));

    app.listen(appConfig.port, 
        ()=> {
            console.log(`Server has started on ${appConfig.port}`)
        }
    );
}

appInit();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const connectMongo = require("connect-mongo");
const path = require("path");
const exhbs = require("express-handlebars");
const appConfig_1 = require("./appConfig");
const userAccount_1 = require("./routes/userAccount");
const userAccount_2 = require("./models/userAccount");
const login_1 = require("./routes/login");
const main_1 = require("./routes/main");
const project_1 = require("./routes/project");
const logout_1 = require("./routes/logout");
const mongoos_1 = require("./lib/mongoos");
const report_1 = require("./routes/report");
const app = express();
//todo make mongoose connectin helper
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exhbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(cookieParser());
const MongoStore = connectMongo(session);
app.use(session({ secret: appConfig_1.sessionConfig.secret,
    store: new MongoStore({ mongooseConnection: mongoos_1.mongooseConnection.reportal }),
    resave: true,
    saveUninitialized: true
}));
app.get('/about', (req, res) => {
    res.render('reports');
});
app.use((req, res, next) => {
    // console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
    next();
});
app.use(main_1.mainRouter);
app.use(report_1.reportRouter);
app.use(userAccount_1.userAccountRouter);
app.use(login_1.loginRouter);
app.use(logout_1.logoutRouter);
app.use(project_1.projectRouter);
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.status(404).send('Path doesnt exist');
});
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Server error');
});
async function appInit() {
    const admin = await userAccount_2.UserAccountModel.findOne({ name: 'admin' }).exec();
    if (!admin) {
        console.log('Admin account creating');
        const newAdmin = new userAccount_2.UserAccountModel({ name: 'admin', password: 'admin' });
        await newAdmin.save();
        console.log('Admin account created');
        console.log('Guest account creating');
        const guest = new userAccount_2.UserAccountModel({ name: 'guest', password: 'guest' });
        await guest.save();
        console.log('Guest account created');
    }
    app.listen(appConfig_1.appConfig.port, () => console.log(`Server has started on ${appConfig_1.appConfig.port}`));
}
appInit();

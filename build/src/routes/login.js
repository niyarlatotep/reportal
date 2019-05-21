"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userAccount_1 = require("../models/userAccount");
const express = require("express");
const loginRouter = express.Router();
exports.loginRouter = loginRouter;
loginRouter.post('/login', async (req, res) => {
    const userName = req.body.name;
    const password = req.body.password;
    try {
        const currentUserAccount = await userAccount_1.UserAccountModel.authorize(userName, password);
        if (currentUserAccount) {
            req.session.user = currentUserAccount;
            res.send();
        }
        else {
            res.status(403).send();
        }
    }
    catch (e) {
        console.error(e);
    }
});

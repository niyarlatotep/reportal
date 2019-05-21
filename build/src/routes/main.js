"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const mainRouter = express.Router();
exports.mainRouter = mainRouter;
mainRouter.get('/', async (req, res, next) => {
    if (!req.session.user) {
        res.sendFile(path.join(__dirname, '../public/signin.html'));
    }
    else {
        res.redirect('/projects');
    }
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logoutRouter = express.Router();
exports.logoutRouter = logoutRouter;
logoutRouter.post('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

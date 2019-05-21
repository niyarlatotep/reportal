"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const personRouter = express.Router();
exports.personRouter = personRouter;
personRouter.get('/person', (req, res) => {
    res.send('You have requested a person');
});
personRouter.get('/person/:name', (req, res) => {
    res.send(`You have requested a person ${req.params.name}`);
});

const express = require('express');

const planetRouter = require('./planet_router');
const launchRouter = require('./launch_router');

const api_v1 = express.Router();

api_v1.use('/planets',planetRouter);
api_v1.use('/launches',launchRouter);

module.exports = api_v1;
const express = require('express');

const {
    httpGetAllLaunches,
    httpAddNewLaunches,
} = require('../controller/launch_controller');
const launchRouter = express.Router();

launchRouter.get('/', httpGetAllLaunches);
launchRouter.post('/',httpAddNewLaunches)

module.exports = launchRouter;


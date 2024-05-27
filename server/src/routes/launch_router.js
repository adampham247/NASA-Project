const express = require('express');

const {
    httpGetAllLaunches,
    httpAddNewLaunches,
    httpAbortLaunch,
} = require('../controller/launch_controller');
const launchRouter = express.Router();

launchRouter.get('/', httpGetAllLaunches);
launchRouter.post('/',httpAddNewLaunches)
launchRouter.delete('/:id', httpAbortLaunch)

module.exports = launchRouter;


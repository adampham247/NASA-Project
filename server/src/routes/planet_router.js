const express = require('express');
const planetRouter = express.Router();

const {
     httpGetAllPlanets
} = require('../controller/planet_controller');


planetRouter.get('/', httpGetAllPlanets);

module.exports = planetRouter;


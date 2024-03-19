const express = require('express');

const {
    getAllPlanets
} = require('../controller/planet_controller');
const planetRouter = express.Router();

planetRouter.get('/planets', getAllPlanets);

module.exports = planetRouter;


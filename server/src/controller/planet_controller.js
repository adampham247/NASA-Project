const {planets} = require('../models/planet_model');

function getAllPlanets(req,res){
    return res.status(200).json(planets);
}

module.exports = {
    getAllPlanets,
}
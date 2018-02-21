var Floor = require('../models/floor');


var okWithBodyResponseCb = function(res) {
    return function(obj){
        res.status(200).json(obj);
    }
}

var okResponseCb = function(res) {
    return function(){
        res.status(200).end();
    }
}

var createdResponseCb = function(res) {
    return function(){
        res.status(201).end();
    }
}

var nocontentResponseCb = function(res) {
    return function(){
        res.status(204).end();
    }
}

var badWithBodyResponseCb = function(res) {
    return function(obj){
        res.status(400).json(obj);
    }
}

var iseWithBodyResponseCb = function(res){
    return function(obj){
        res.status(500).json(obj);
    }
}


module.exports.getFloors = function (req, res) {
    Floor.getFloors(okWithBodyResponseCb(res), iseWithBodyResponseCb(res));
}

module.exports.getFloorByLevel = function(req, res) {
    Floor.getFloorByLevel(req.params.level, okWithBodyResponseCb(res), iseWithBodyResponseCb(res));
}

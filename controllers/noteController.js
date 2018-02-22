var Note = require('../models/note');
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


module.exports.addNotes = function (req, res) {
    Floor.updateFloorNote(req.body.msg, req.body.user);
    Note.addNotes(req.body.msg, req.body.user.uuid, req.body.user.buyFloor, createdResponseCb(res), iseWithBodyResponseCb(res));
}

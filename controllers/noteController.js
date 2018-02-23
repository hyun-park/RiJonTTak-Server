var Note = require('../models/note');
var Floor = require('../models/floor');
var User = require('../models/user');
var fcmPush = require('../lib/fcm');

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
    return function(obj){
        res.status(201).json(obj);
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
    var addNoteCb = function(user){
        Floor.updateFloorNote(req.body.msg, user);
        Note.addNotes(req.body.msg, user.uuid, user.buyFloor, user.currentFloor, createdResponseCb(res), iseWithBodyResponseCb(res));

        var msg = {
            type: "note-added",
            floor: user.currentFloor
        }

        fcmPush("/topics/level"+user.currentFloor, msg);
    };
    User.getUserByUuid(req.body.userUuid, addNoteCb, iseWithBodyResponseCb(res));
}

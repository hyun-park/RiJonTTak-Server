var User = require('../models/user');

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



module.exports.getUserList = function(req, res){
    User.getUsers(okWithBodyResponseCb(res), badWithBodyResponseCb(res));
}
module.exports.getUser =  function(req, res){
    User.getUserByUuid(req.params.uuid, okWithBodyResponseCb(res), badWithBodyResponseCb(res));
}

module.exports.signInOrUpUser = function(req, res) {
    var responseCb = function(verify_info) {
        if (typeof verify_info === 'undefined') {
            res.status(201).end();
        } else {
            if (verify_info.result) {
                res.status(200).json({
                    email: verify_info.email,
                    uuid: verify_info.uuid
                });
            } else {
                res.status(401).json({
                    message: verify_info.email + " exists, but oauth key value is wrong."
                });
            }
        }
    }
    User.signInOrUpUser(req.body, responseCb, iseWithBodyResponseCb(res));
}
module.exports.updateUser = function(req, res){
    User.updateUser(req.params.uuid, req.body, nocontentResponseCb(res), iseWithBodyResponseCb(res));
}

module.exports.updateUsersFloor = function(req, res){
    User.updateUsersFloor(9, 10);
    res.status(202).end();
}
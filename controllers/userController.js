var User = require('../models/user');
var Floor = require('../models/floor');
var Logger = require('../lib/logs');

// if(app.get("env") === "development") {
//     var logFilePath = "logs/development.log"
// } else {
var logFilePath = "logs/production.log"
// }
var logger = new Logger(logFilePath);

var okWithBodyResponseCb = function(res) {
    return function(obj){
        res.status(200).json(obj);
        logger.debug(obj);
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
        logger.debug(obj);
    }
}

var iseWithBodyResponseCb = function(res){
    return function(obj){
        res.status(500).json(obj);
        logger.debug(obj);
    }
}



module.exports.getUserList = function(req, res){
    User.getUsers(okWithBodyResponseCb(res), badWithBodyResponseCb(res));
}
module.exports.getUser =  function(req, res){
    logger.debug(req.params);
    User.getUserByUuid(req.params.uuid, okWithBodyResponseCb(res), badWithBodyResponseCb(res));
}

module.exports.signInOrUpUser = function(req, res) {
    logger.debug(req.body);
    var responseCb = function(user_info) {
        if (typeof user_info.result === 'undefined') {
            res.status(201).json(user_info);
        } else {
            if (user_info.result) {
                res.status(200).json(user_info.user);
            } else {
                res.status(401).json({
                    message: user_info.user.email + " exists, but oauth key value is wrong."
                });
            }
        }
    }
    User.signInOrUpUser(req.body, responseCb, iseWithBodyResponseCb(res));
}
module.exports.updateUser = function(req, res){
    logger.debug(req.params, req.body);
    User.updateUser(req.params.uuid, req.body, okWithBodyResponseCb(res), iseWithBodyResponseCb(res));
}
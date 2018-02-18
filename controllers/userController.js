var User = require('../models/user');


module.exports.getUserList = function(req, res){
    res.json(User.getUsers());
}
module.exports.getUser =  function(req, res){
    res.json(User.getUserByUuid(req.params.uuid));
}
module.exports.addUser = function(req, res){
    User.addNewUser(req.body);
    res.status(201).end();
}
module.exports.updateUser = function(req, res){
    User.updateUser(req.params.uuid, req.body);
    res.status(204).end();
}
var User = require('../models/user');

module.exports.getUserList = function(req, res){
    res.json(User.getUsers());
}
module.exports.getUser =  function(req, res){
    res.json(User.getUserByUuid(req.params.uuid));
}

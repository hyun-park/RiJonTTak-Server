var User = require('../models/user');


module.exports.getUserList = function(req, res){
    res.status(200).json(User.getUsers());
}
module.exports.getUser =  function(req, res){
    res.status(200).json(User.getUserByUuid(req.params.uuid));
}
module.exports.signInOrUpUser = function(req, res) {
    var verify_info = User.signInOrUpUser(req.body);
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
                message: verify_info.email + " exists, but value of key is wrong."
            });
        }
    }
}
module.exports.updateUser = function(req, res){
    User.updateUser(req.params.uuid, req.body);
    res.status(204).end();
}
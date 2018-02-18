module.exports = function(app){
    var express = require('express');
    var router = express.Router();

    var UserController = require('../controllers/userController');

    //router.get('/', function(req, res){
    //    var js = {hi:"gi"}
    //    res.json(js);
    //});

    router.get('/', UserController.getUserList);

    router.get('/:uuid', UserController.getUser);

    return router;
}


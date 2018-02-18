module.exports = function(app){
    var express = require('express');
    var router = express.Router();

    var UserController = require('../controllers/userController');

    router.get('/', UserController.getUserList);

    router.get('/:uuid', UserController.getUser);

    router.post('/', UserController.addUser);

    router.put('/:uuid', UserController.updateUser);

    return router;
}


module.exports = function(app){
    var express = require('express');
    var router = express.Router();

    var UserController = require('../controllers/userController');

    router.get('/', UserController.getUserList);

    router.post('/', UserController.signInOrUpUser);

    router.get('/update', UserController.updateUsersFloor);

    router.get('/:uuid', UserController.getUser);

    router.put('/:uuid', UserController.updateUser);


    return router;
}


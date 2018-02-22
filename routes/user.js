module.exports = function(app, cache){
    var express = require('express');
    var router = express.Router();

    var UserController = require('../controllers/userController');

    router.get('/', cache(5), UserController.getUserList);

    router.post('/', UserController.signInOrUpUser);

    router.get('/:uuid', UserController.getUser);

    router.put('/:uuid', UserController.updateUser);


    return router;
}


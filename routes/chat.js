module.exports = function(app){
    var express = require('express');
    var router = express.Router();

    var ChatController = require('../controllers/chatController');

    // router.get('/', UserController.getUserList);

    router.post('/', ChatController.addChats);

    return router;
}

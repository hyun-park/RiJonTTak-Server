module.exports = function(app){
    var express = require('express');
    var router = express.Router();

    var NoteController = require('../controllers/noteController');

    // router.get('/', UserController.getUserList);

    router.post('/', NoteController.addNotes);

    return router;
}

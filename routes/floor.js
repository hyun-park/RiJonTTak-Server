module.exports = function(app){
    var express = require('express');
    var router = express.Router();

    var FloorController = require('../controllers/floorController');

    router.get('/', FloorController.getFloors);

    router.get('/:level', FloorController.getFloorByLevel);

    return router;
}


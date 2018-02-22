module.exports = function(app, cache){
    var express = require('express');
    var router = express.Router();

    var FloorController = require('../controllers/floorController');

    router.get('/', cache(5), FloorController.getFloors);

    router.get('/:level', cache(5), FloorController.getFloorByLevel);

    return router;
}


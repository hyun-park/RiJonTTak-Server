module.exports = function(app, cache){
    var express = require('express');
    var router = express.Router();

    var CurrencyController = require('../controllers/currencyController');

    router.get('/', cache(10), CurrencyController.getCurrency);

    router.post('/', CurrencyController.manipulateCurrency);

    return router;
}
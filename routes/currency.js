module.exports = function(app){
    var express = require('express');
    var router = express.Router();

    var CurrencyController = require('../controllers/currencyController');

    router.get('/', CurrencyController.getCurrency);

    router.post('/', CurrencyController.manipulateCurrency);

    return router;
}
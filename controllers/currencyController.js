var Currency = require('../models/currency');

var okWithBodyResponseCb = function(res) {
    return function(obj){
        res.status(200).json(obj);
    }
}

var okResponseCb = function(res) {
    return function(){
        res.status(200).end();
    }
}

module.exports.getCurrency = function(req, res) {
    Currency.getCurrency(okWithBodyResponseCb(res));
}

module.exports.manipulateCurrency = function(req, res) {
    Currency.manipulateCurrency(req.body.floor, okResponseCb(res));
}
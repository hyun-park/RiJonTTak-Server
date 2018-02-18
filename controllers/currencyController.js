var Currency = require('../models/currency');

module.exports.getCurrency = function(req, res){
    Currency.getCurrency(res);
}
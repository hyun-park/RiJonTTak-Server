const API_URL = "https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=xrp_krw";
var request = require('request');
var getCurrency = function() {
    request(API_URL, function (error, response, body) {
    });
}

getCurrency();
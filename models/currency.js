const API_URL = "https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=xrp_krw";
var request = require('request');
var ff = require('../lib/frequentFunctions')();
var firebase = require("firebase");
var currencyRef = firebase.database().ref("last_currency");

var rippleCurrencyToFloor = function(currency) {
    return Math.floor(Number(currency)/100);
}

var getCurrency = function(successCb) {
    request(API_URL, function(err, apiResponse, apibody){
        var rawCurrency = JSON.parse(apibody);
        var refinedCurrency = {
            time: ff.timestampToDate(rawCurrency.timestamp),
            floor: rippleCurrencyToFloor(rawCurrency.last)
        }
        successCb(refinedCurrency);
    });
};

var manipulateCurrency = function(updateFloor, successCb) {
    currencyRef.child("floor").set(Number(updateFloor));
    successCb();
};

module.exports.getCurrency = function(successCb) {
    return getCurrency(successCb);
};

module.exports.manipulateCurrency = function(updateFloor, successCb) {
    return manipulateCurrency(updateFloor, successCb);
}
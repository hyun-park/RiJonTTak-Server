var firebase = require("firebase");
var ff = require('./lib/frequentFunctions')();

firebase.initializeApp({
    serviceAccount: "./credentials/RiJonTtak-308ee4a7684d.json",
    databaseURL: "https://rijonttak.firebaseio.com"
});

var usersRef = firebase.database().ref("users");
var currencyRef = firebase.database().ref("last_currency");



var CronJob = require('cron').CronJob;
const API_URL = "https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=xrp_krw";
var request = require('request');

var getCurrency = function(cb) {
    request(API_URL, function(err, apiResponse, apibody){
        var rawCurrency = JSON.parse(apibody);
        cb(Math.floor(rawCurrency.last/100));
    });
};


new CronJob('1 * * * * *', function() {
    console.log('You will see this message every sec');
    var updateCallBack = function(currency) {
        var currency = Number(currency);
        currencyRef.once("value").then(function(snapshot){
            var lastCurrency = Number(snapshot.val().floor);
            if(currency > lastCurrency) {
                for(var i=0;i<(currency-lastCurrency);i++) {
                    usersRef.orderByChild("current_floor").equalTo(lastCurrency+i).once("value")
                        .then(function(snapshot){
                            var users = snapshot.val();
                            var usersKey = Object.keys(users);

                            for (var i=0; i<usersKey.length;i++) {
                                users[usersKey[i]]["current_floor"] = Number(currency);
                            }
                            usersRef.update(users);
                        })
                }
                currencyRef.set({
                    upadted_at: ff.getCurrentDate(),
                    floor: currency
                }).then(function(){
                        console.log("updated last currency: " + currency);
                        console.log("updated users floors: " + lastCurrency + " to " + currency);
                });
            } else {
                currencyRef.set({
                    upadted_at: ff.getCurrentDate(),
                    floor: currency
                }).then(function(){
                    console.log("updated last currency: " + currency);
                });
            }
        }, function(err){
            console.log("error occurred: " + err.code);
        });
    }

    getCurrency(updateCallBack);

}, null, true, 'Asia/Seoul');
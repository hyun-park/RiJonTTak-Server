var CronJob = require('cron').CronJob;
const API_URL = "https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=xrp_krw";
var request = require('request');

var getCurrency = function() {
    request(API_URL, function(err, apiResponse, apibody){
        var rawCurrency = JSON.parse(apibody);
        console.log(rawCurrency.last);
    });
};


new CronJob('* * * * * *', function() {
    console.log('You will see this message every second');
    getCurrency();

}, null, true, 'Asia/Seoul');
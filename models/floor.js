var firebase = require("firebase");
var ff = require('../lib/frequentFunctions')();

firebase.initializeApp({
    serviceAccount: "../credentials/RiJonTtak-308ee4a7684d.json",
    databaseURL: "https://rijonttak.firebaseio.com"
});

var floorsRef = firebase.database().ref("floors");


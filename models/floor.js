var firebase = require("firebase");
var ff = require('../lib/frequentFunctions')();

var floorsRef = firebase.database().ref("floors");

var getFloors = function(successCb, errorCb) {
    floorsRef.once("value").then(function(snapshot){
        successCb(snapshot.val().reverse());
    }, function(err){
        errorCb({ "message": "error occurred: " + err.code });
        console.log("error occurred: " + err.code);
    });
}

var getFloorByLevel = function(level, successCb, errorCb) {
    floorsRef.child(Number(level)-1).once("value")
        .then(function(snapshot){
            successCb(snapshot.val());
        }, function(err){
            errorCb({ "message": "error occurred: " + err.code });
            console.log("error occurred: " + err.code);
        });
}

var updateFloorPopulation = function(level, successCb, errorCb) {

}

var updateFloorChats = function(level, msg, successCb, errorCb) {

}

module.exports.getFloors = function(successCb, errorCb) {
    return getFloors(successCb, errorCb);
}

module.exports.getFloorByLevel = function(level, successCb, errorCb) {
    return getFloorByLevel(level, successCb, errorCb);
}
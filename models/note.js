var firebase = require("firebase");
var ff = require('../lib/frequentFunctions')();

var notesRef = firebase.database().ref("notes");

var addNotes = function(msg, userUuid, buyFloor, currentFloor, successCb, errorCb) {
    var newNote = {
        message: msg,
        userUuid: userUuid,
        buyFloor: buyFloor,
        currentFloor: currentFloor,
        createdAt: ff.getCurrentDate()
    }
    var newNoteRef = notesRef.push();
    newNoteRef.set(newNote)
        .then(function(){
            successCb(newNote);
        })
        .catch(function(err) {
            errorCb({ "message": "error occurred: " + err.code});
            throw new Error("error occurred: " + err.code);
        });
}

module.exports.addNotes = function(msg, userUuid, buyFloor, currentFloor, successCb, errorCb) {
    return addNotes(msg, userUuid, buyFloor, currentFloor, successCb, errorCb);
};
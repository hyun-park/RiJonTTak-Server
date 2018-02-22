var firebase = require("firebase");
var ff = require('../lib/frequentFunctions')();

var notesRef = firebase.database().ref("notes");

var addNotes = function(msg, userUuid, buyFloor, successCb, errorCb) {
    var newNote = {
        message: msg,
        userUuid: userUuid,
        buyFloor: buyFloor,
        createdAt: ff.getCurrentDate()
    }
    var newNoteRef = notesRef.push();
    newNoteRef.set(newNote)
        .then(function(){
            successCb();
        })
        .catch(function(err) {
            errorCb({ "message": "error occurred: " + err.code});
            throw new Error("error occurred: " + err.code);
        });
}

module.exports.addNotes = function(msg, userUuid, buyFloor, successCb, errorCb) {
    return addNotes(msg, userUuid, buyFloor, successCb, errorCb);
};
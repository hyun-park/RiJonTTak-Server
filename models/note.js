var firebase = require("firebase");
var ff = require('../lib/frequentFunctions')();

var notesRef = firebase.database().ref("notes");

var addNotes = function(msg, user_uuid, buy_floor, successCb, errorCb) {
    var newNote = {
        message: msg,
        user_uuid: user_uuid,
        buy_floor: buy_floor,
        created_at: ff.getCurrentDate()
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

module.exports.addNotes = function(msg, user_uuid, buy_floor, successCb, errorCb) {
    return addNotes(msg, user_uuid, buy_floor, successCb, errorCb);
};
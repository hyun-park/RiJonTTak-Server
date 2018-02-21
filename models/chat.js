var firebase = require("firebase");
var ff = require('../lib/frequentFunctions')();

var chatsRef = firebase.database().ref("chats");

var addChats = function(msg, user_uuid, buy_floor, successCb, errorCb) {
    var newChat = {
        message: msg,
        user_uuid: user_uuid,
        buy_floor: buy_floor,
        created_at: ff.getCurrentDate()
    }
    var newChatRef = chatsRef.push();
    newChatRef.set(newChat)
        .then(function(){
            successCb();
        })
        .catch(function(err) {
            errorCb({ "message": "error occurred: " + err.code});
            throw new Error("error occurred: " + err.code);
        });
}

module.exports.addChats = function(msg, user_uuid, buy_floor, successCb, errorCb) {
    return addChats(msg, user_uuid, buy_floor, successCb, errorCb);
};
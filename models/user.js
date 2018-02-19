var users = [];
var firebase = require("firebase");
firebase.initializeApp({
    serviceAccount: "../credentials/RiJonTtak-308ee4a7684d.json",
    databaseURL: "https://rijonttak.firebaseio.com"
});
var userRef = firebase.database().ref("users");

var ff = require('../lib/frequentFunctions')();

var getUsers =  function(cb){
    userRef.once("value").then(function(snapshot){
        cb(snapshot.val());
    }, function(err){
        console.log("error occurred: " + err.code);
    });
};

var getUserByUuid = function(uuid, cb){
    userRef.once("value").then(function(snapshot){
        var users = snapshot.val();
        var user = users[uuid];
        cb(user);
    }, function(err){
        throw new Error("error occurred: " + err.code);
    });
};

var authenticateUser = function(_user, cb) {
    userRef.once("value").then(function(snapshot){
        var users = snapshot.val();
        // TODO Firebase Query 찾아 보기
        for(var i=0; i<users.length; i++){
            if(users[i].email === _email) {
                var user = users[i];
                return
            } else {
                throw new Error("Cannot find user with email: " + _email);
            }
        }

        if (user.oauth_key === _user.oauth_key) {
            var resultData =  {
                result: true,
                uuid: user.uuid,
                email: user.email
            };
        } else {
            var resultData = {
                result: false
            };
        }
        cb(resultData);

    }, function(err){
        throw new Error("error occurred: " + err.code);
    });
};


var addUser = function(user) {
    var newUser = {
        uuid: ff.getRandomString(10),
        email: user.email,
        oauth_key: user.oauth_key,
        started_at: ff.getCurrentDate(),
        created_at: ff.getCurrentDate(),
        updated_at: ff.getCurrentDate()
    };
    userRef.push(newUser);
};

var updateUser = function(uuid, data) {
    var user = getUserByUuid(uuid);
    user.buy_floor = Number(data.buy_floor);
    user.goal_floor = Number(data.goal_floor);
    user.current_floor = Number(data.current_floor);
    user.updated_at = ff.getCurrentDate();
};

module.exports.getUsers = function(cb) {
    return getUsers(cb);
};

module.exports.getUserByUuid = function(uuid, cb) {
    return getUserByUuid(uuid, cb);
};

module.exports.signInOrUpUser = function(user, cb) {
    try {
        return authenticateUser(user, cb);
    } catch(err) {
        // throw new Error(err.message);
        return addUser(user);
    }
};

module.exports.updateUser = function(uuid, data) {
    updateUser(uuid, data);
};
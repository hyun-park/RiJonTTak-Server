var firebase = require("firebase");
var ff = require('../lib/frequentFunctions')();

firebase.initializeApp({
    serviceAccount: "../credentials/RiJonTtak-308ee4a7684d.json",
    databaseURL: "https://rijonttak.firebaseio.com"
});

var usersRef = firebase.database().ref("users");

var getUsers =  function(successCb, errorCb){
    usersRef.once("value").then(function(snapshot){
        successCb(snapshot.val());
    }, function(err){
        errorCb({ "message": "error occurred: " + err.code });
        console.log("error occurred: " + err.code);
    });
};

var getUserByUuid = function(uuid, successCb, errorCb){
    usersRef.child(uuid).once("value").then(function(snapshot){
        var user = snapshot.val();
        if(user !== null) {
            successCb(user);
        } else {
            errorCb({ "message": "Cannot find user with uuid " + uuid});
            console.log("Cannot find user with uuid " + uuid);
        }
    }, function(err){
        errorCb({ "message": "error occurred: " + err.code});
        throw new Error("error occurred: " + err.code);
    });
};

var signInOrUpUser = function(_user, successCb, errorCb){
    usersRef.orderByChild("email").equalTo(_user.email).once("value").then(function(snapshot){
        var userObj = snapshot.val();
        if(userObj !== null) {
            var uuid = Object.keys(userObj)[0];
            var user = userObj[uuid];
            if(user.oauth_key === _user.oauth_key) {
                var resultData =  {
                    result: true,
                    uuid: uuid,
                    email: user.email
                };
            } else {
                var resultData =  {
                    result: false,
                    email: _user.email
                };
            }
            successCb(resultData);

        } else {
          addUser(_user, successCb, errorCb);
        }
    }, function(err){
        throw new Error("error occurred: " + err.code);
    });
}

var addUser = function(user, successCb, errorCb) {
    var newUser = {
        email: user.email,
        oauth_key: user.oauth_key,
        fcm_key: user.fcm_key,
        started_at: ff.getCurrentDate(),
        created_at: ff.getCurrentDate(),
        updated_at: ff.getCurrentDate()
    };
    var newUserRef = usersRef.push();
    newUserRef.set(newUser)
        .then(function() {
            successCb();
        })
        .catch(function(err) {
            errorCb({ "message": "error occurred: " + err.code});
            throw new Error("error occurred: " + err.code);
        });
};

var updateUser = function(uuid, data, successCb, errorCb) {
    var userUpdateCb = function(user){
        user.buy_floor = Number(data.buy_floor);
        user.goal_floor = Number(data.goal_floor);
        user.current_floor = Number(data.current_floor);
        user.updated_at = ff.getCurrentDate();
        usersRef.child(uuid).set(user)
            .then(function () {
                successCb();
            })
            .catch(function(err) {
                errorCb({ "message": "error occurred: " + err.code});
                throw new Error("error occurred: " + err.code);
            });
    }
    getUserByUuid(uuid, userUpdateCb);
};

var updateUsersFloor = function(currentFloor, updatedFloor) {
    usersRef.orderByChild("current_floor").equalTo(Number(currentFloor)).once("value")
        .then(function(snapshot){
            var users = snapshot.val();
            var usersKey = Object.keys(users);

            for (var i=0; i<usersKey.length;i++) {
                users[usersKey[i]]["current_floor"] = Number(updatedFloor);
            }

            usersRef.update(users);
        })
}

module.exports.getUsers = function(successCb, errorCb) {
    return getUsers(successCb, errorCb);
};

module.exports.getUserByUuid = function(uuid, successCb, errorCb) {
    return getUserByUuid(uuid, successCb, errorCb);
};

module.exports.signInOrUpUser = function(user, successCb, errorCb) {
    return signInOrUpUser(user, successCb, errorCb);
};

module.exports.updateUser = function(uuid, data, successCb, errorCb) {
    return updateUser(uuid, data, successCb, errorCb);
};

module.exports.updateUsersFloor = function(currentFloor, updatedFloor) {
    return updateUsersFloor(currentFloor, updatedFloor);
};
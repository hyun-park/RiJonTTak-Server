var firebase = require("firebase");
var ff = require('../lib/frequentFunctions')();

var fs = require('fs');
var rawdata = fs.readFileSync('./credentials/RiJonTtak-fcm.json');
var serverKey = JSON.parse(rawdata)["server-key"];

const FCM_TOPIC_ADD_API_URL = "https://iid.googleapis.com/iid/v1:batchAdd"
const FCM_TOPIC_REMOVE_API_URL = "https://iid.googleapis.com/iid/v1:batchRemove"

var request = require('request');

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

// var getUsersByCurrentFloor = function(level, cb) {
//     usersRef.orderByChild("currentFloor").equalTo(Number(level)).once("value")
//         .then(function(snapshot){
//             var users = snapshot.val();
//             if(users !== null) {
//                 var uuids = Object.key(users);
//
//             } else {
//                 // do nothing
//             }
//
//         }, function(err){
//             throw new Error("error occurred: " + err.code);
//         });
// }

var signInOrUpUser = function(_user, successCb, errorCb){
    usersRef.orderByChild("email").equalTo(_user.email).once("value")
        .then(function(snapshot){
            var userObj = snapshot.val();
            if(userObj !== null){
                var uuid = Object.keys(userObj)[0];
                var user = userObj[uuid];
                user["uuid"] = uuid;
                if(user.oauthKey === _user.oauthKey) {
                    var resultData = {
                        result: true,
                        user: user
                    }
                } else {
                    var resultData = {
                        result: false,
                        user: _user
                    }
                }
                successCb(resultData);
            } else {
                addUser(_user, successCb, errorCb);
            }
        }, function(err){
            throw new Error("error occurred: " + err.code);
        });
};

var addUser = function(user, successCb, errorCb) {
    var newUser = {
        email: user.email,
        oauthKey: user.oauthKey,
        fcmKey: user.fcmKey,
        startedAt: ff.getCurrentDate(),
        createdAt: ff.getCurrentDate(),
        updatedAt: ff.getCurrentDate()
    };
    var newUserRef = usersRef.push();
    newUser["uuid"] = newUserRef.key;
    newUserRef.set(newUser)
        .then(function() {
            successCb(newUser);
        })
        .catch(function(err) {
            errorCb({ "message": "error occurred: " + err.code});
            throw new Error("error occurred: " + err.code);
        });
};

var updateUser = function(uuid, data, successCb, errorCb) {
    var userUpdateCb = function(user){
        try {
            if(data.fcmKey !== ""){
                user.fcmKey = data.fcmKey;
            }
            if(data.buyFloor !== ""){
                user.buyFloor = Number(data.buyFloor);
            }
            if(data.currentFloor !== ""){
                user.currentFloor = Number(data.currentFloor);
            }
            if(data.goalFloor !== ""){
                user.goalFloor = Number(data.goalFloor);
            }
            user.updatedAt = ff.getCurrentDate();
            usersRef.child(uuid).set(user)
                .then(function () {
                    successCb(user);
                })
                .catch(function(err) {
                    errorCb({ "message": "error occurred: " + err.code});
                    throw new Error("error occurred: " + err.code);
                });
        } catch(err) {
            errorCb({ "message": "error occurred: " + err.code});
        }
    };
    getUserByUuid(uuid, userUpdateCb, errorCb);
};

var updateUsersFloor = function(currentFloor, updatedFloor, fcm) {
    usersRef.orderByChild("currentFloor").equalTo(Number(currentFloor)).once("value")
        .then(function(snapshot){
            var users = snapshot.val();
            if(users !== undefined) {
                // TODO 효율적으로 호출하기...
                var usersKey = Object.keys(users);

                for (var i=0; i<usersKey.length;i++) {
                    users[usersKey[i]]["currentFloor"] = Number(updatedFloor);
                }

                fcm.push(fcm.to, fcm.msg);
                usersRef.update(users);
                addUsersTopic(fcm.to, ["n2j3d18239d"]);
            } else {
                // do nothing
            }
        })
        .catch(function(err) {
            throw new Error("error occurred: " + err);
        })
};

var addUsersTopic = function(topic, fcmTokens) {
    console.log("addUsersTopic 까지 옴");
    var options = {
        uri: FCM_TOPIC_ADD_API_URL,
        method: 'POST',
        headers: {
            'Authorization': 'key=' + serverKey
        },
        json: {
            "to": topic,
            "registration_tokens": fcmTokens
        }
    };

    request(options, function (error, response, body) {
        console.log("리쿼스트 요청 하고나서 콜백 중!");
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            console.log(info)
        } else {
            console.log("유저 토픽 업데이트 에러 발생");
            console.log(error);
            console.log(response);
            var info = JSON.parse(body);
            console.log(info)
        }
    });
}

var removeUsersTopic = function() {

}

var resetUser = function(uuid, successCb, errorCb) {
    var userResetCb = function(user) {
        user.buyFloor = 0;
        user.currentFloor = 0;
        user.goalFloor = 0;
        user.startedAt = ff.getCurrentDate();

        usersRef.child(uuid).set(user)
            .then(function(){
                successCb(user)
            })
            .catch(function(err){
                errorCb({ "message": "error occurred: " + err.code});
                throw new Error("error occurred: " + err.code);
            });
    };
    getUserByUuid(uuid, userResetCb, errorCb);
};

var getUsersPopulation = function(cb){
    var usersPopulation = new Array(60+1).join('0').split('').map(parseFloat);
    usersRef.orderByChild("currentFloor")
        .on("child_added", function(data) {
            // TODO 효율적으로 호출하기...
            if(data.val().currentFloor !== undefined) {
                usersPopulation[Number(data.val().currentFloor)-1] += 1
            } else {
                //do nothing
            }
            usersRef.off('child_added');
            cb(usersPopulation);
        });
};

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

module.exports.updateUsersFloor = function(currentFloor, updatedFloor, fcm) {
    return updateUsersFloor(currentFloor, updatedFloor, fcm);
};

module.exports.getUsersPopulation = function(cb) {
    return getUsersPopulation(cb);
};

module.exports.resetUser = function(uuid, successCb, errorCb){
    return resetUser(uuid, successCb, errorCb);
};
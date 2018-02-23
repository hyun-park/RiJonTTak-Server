var firebase = require("firebase");
var ff = require('../lib/frequentFunctions')();

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
            if(user.oauthKey === _user.oauthKey) {
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
        oauthKey: user.oauthKey,
        fcmKey: user.fcmKey,
        startedAt: ff.getCurrentDate(),
        createdAt: ff.getCurrentDate(),
        updatedAt: ff.getCurrentDate()
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
        try {
            user.fcmKey = data.fcmKey;
            user.buyFloor = Number(data.buyFloor);
            user.goalFloor = Number(data.goalFloor);
            user.currentFloor = Number(data.currentFloor);
            user.updatedAt = ff.getCurrentDate();
            usersRef.child(uuid).set(user)
                .then(function () {
                    successCb();
                })
                .catch(function(err) {
                    errorCb({ "message": "error occurred: " + err.code});
                    throw new Error("error occurred: " + err.code);
                });
        } catch(err) {
            errorCb({ "message": "error occurred: " + err.code});
        }
    }
    getUserByUuid(uuid, userUpdateCb);
};

var updateUsersFloor = function(currentFloor, updatedFloor) {
    usersRef.orderByChild("currentFloor").equalTo(Number(currentFloor)).once("value")
        .then(function(snapshot){
            // TODO 효율적으로 호출하기...
            var users = snapshot.val();
            var usersKey = Object.keys(users);

            for (var i=0; i<usersKey.length;i++) {
                users[usersKey[i]]["currentFloor"] = Number(updatedFloor);
            }

            usersRef.update(users);
        })
}

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

module.exports.getUsersPopulation = function(cb) {
    return getUsersPopulation(cb);
}
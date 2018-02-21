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

var updateFloorPopulation = function(user, updatedFloor) {
    floorsRef.once("value")
        .then(function(snapshot){
            var floors = snapshot.val();
            floors[Number(user.current_floor) - 1]["population"] -= 1
            floors[Number(updatedFloor) - 1]["population"] += 1
            floorsRef.set(floors)
                .then(function(){
                  console.log(updatedFloor + " floor updated successfully.");
                })
                .catch(function(err){
                    console.log("error occurred: " + err.code);
                });
        });
}

var updateFloorNote = function(msg, user) {
      floorsRef.once("value")
          .then(function(snapshot){
              var floors = snapshot.val();
              var note = {msg: msg, buy_floor: Number(user.buy_floor)};
              var floorNotes = floors[Number(user.current_floor) - 1]["last_notes"]
              if(floorNotes.length >= 5){
                  floorNotes.shift();
                  floorNotes.push(note);
              } else {
                  floorNotes.push(note);
              }
              floorsRef.set(floors)
                  .then(function(){
                    console.log(user.current_floor + " floor chat added successfully.");
                  })
                  .catch(function(err){
                      console.log("error occurred: " + err.code);
                  });
          }
}

module.exports.getFloors = function(successCb, errorCb) {
    return getFloors(successCb, errorCb);
}

module.exports.getFloorByLevel = function(level, successCb, errorCb) {
    return getFloorByLevel(level, successCb, errorCb);
}

module.exports.updateFloorPopulation = function(user, updatedFloor) {
    return updateFloorPopulation(user, updatedFloor);
}

module.exports.updateFloorNote = function(msg, user) {
    return updateFloorNote(msg, user);
}

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

var addFloorPopulation = function(newUserFloor) {
    floorsRef.child(Number(newUserFloor)-1).once("value")
        .then(function(snapshot){
            var floor = snapshot.val();
            floor.population += 1;
            floorsRef.child(Number(newUserFloor)-1).set(floor);
        })
        .catch(function(err){
            console.log("error occurred: " + err.code);
        })
}

var updateFloorPopulation = function(usersPopulation) {
    floorsRef.once("value")
        .then(function(snapshot){
            var floors = snapshot.val();
            for(var i=0; i<floors.length;i++) {
                floors[i]["population"] = Number(usersPopulation[i]);
            }
            floorsRef.set(floors);
        });
}

var updateFloorNote = function(msg, user) {
      floorsRef.once("value")
          .then(function(snapshot){
              var floors = snapshot.val();
              var note = {msg: msg, buy_floor: Number(user.buy_floor)};
              var floorNotes = floors[Number(user.current_floor) - 1]["last_notes"];
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
          });
}

module.exports.getFloors = function(successCb, errorCb) {
    return getFloors(successCb, errorCb);
}

module.exports.getFloorByLevel = function(level, successCb, errorCb) {
    return getFloorByLevel(level, successCb, errorCb);
}

module.exports.addFloorPopulation = function(newUserFloor) {
    return addFloorPopulation(newUserFloor);
}

module.exports.updateFloorPopulation = function(usersPopulation) {
    return updateFloorPopulation(usersPopulation);
}

module.exports.updateFloorNote = function(msg, user) {
    return updateFloorNote(msg, user);
}

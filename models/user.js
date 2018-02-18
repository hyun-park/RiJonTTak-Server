var users = [];

var ff = require('../lib/frequentFunctions')();

var getUsers =  function(){
        return users;
    };
var getUserByUuid = function(uuid){
        for(var i=0; i<users.length; i++){
            if(users[i].uuid === uuid) {
                return users[i]
            } else {
            //pass
            }
        }
        return {}

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
    users.push(newUser);
};

var updateUser = function(uuid, data) {
    var user = getUserByUuid(uuid);
    user.buy_floor = Number(data.buy_floor);
    user.goal_floor = Number(data.goal_floor);
    user.current_floor = Number(data.current_floor);
    user.updated_at = ff.getCurrentDate();
};

module.exports.getUsers = function() {
    return getUsers();
};

module.exports.getUserByUuid = function(uuid) {
    return getUserByUuid(uuid);
};

module.exports.addNewUser = function(user) {
    addUser(user);
};

module.exports.updateUser = function(uuid, data) {
    updateUser(uuid, data);
};
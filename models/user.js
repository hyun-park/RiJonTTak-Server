var users = [{
        uuid: "1nj123jsb8",
        email: "rijon@tak.com",
        oauth_key: "zdk93jsdd",
        buy_floor: 13,
        goal_floor: 20,
        current_floor: 9,
        created_at: 1518840758,
        updated_at: 1518873120
    }, {
        uuid: "mfdmls931hsn",
        email: "rijon@tak.com",
        oauth_key: "1njz90a",
        buy_floor: 24,
        goal_floor: 30,
        current_floor: 12,
        created_at: 1518840758,
        updated_at: 1518873120
    }];

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
        uuid: getRandomString(10),
        email: user.email,
        oauth_key: user.oauth_key,
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp()
    };
    users.push(newUser);
};

var updateUser = function(uuid, data) {
    var user = getUserByUuid(uuid);
    user.buy_floor = data.buy_floor;
    user.goal_floor = data.goal_floor;
    user.current_floor = data.current_floor;
    user.updated_at = getCurrentTimestamp();
};

var getCurrentTimestamp = function() {
    return Math.floor(Date.now()/1000);
};

var getRandomString = function(length) {
    return Math.random().toString(36).substr(2, length);
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
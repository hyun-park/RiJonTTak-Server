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
    }
var getUserByUuid = function(uuid){
        for(var i=0; i<users.length; i++){
            if(users[i].uuid === uuid) {
                return users[i]
            } else {
            //pass
            }
        }
        return {}

    }


module.exports.getUsers = function() {
    return getUsers();
};

module.exports.getUserByUuid = function(uuid) {
    return getUserByUuid(uuid);
};


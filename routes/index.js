var users = require('./../models/user');


module.exports = function(app) {
    app.get('/api/users', function(req, res){

       res.json(users);
    });


    // app.put('/api/users/:user_id', function(req, res){
    //    res.end();
    // });
    //
    // app.post('/api/users/:user_id', function(req, res){
    //    res.end();
    // });
}
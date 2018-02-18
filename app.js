var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var userRouter = require('./routes/user')(app);
app.use('/api/users', userRouter);
//app.use('/api/user', userRouter);


var server = app.listen(port, function(){
    console.log('Example app listening on port ' + port);
});

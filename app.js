var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var userRouter = require('./routes/user')(app);
// TODO url 정규표현식 처리
app.use('/api/users?', userRouter);


var server = app.listen(port, function(){
    console.log('Example app listening on port ' + port);
});

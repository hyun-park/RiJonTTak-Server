var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = require('./routes')(app);

var server = app.listen(port, function(){
    console.log('Example app listening on port ' + port);
});

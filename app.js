var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
var firebase = require("firebase");
var cache = require("./lib/memoryCache");
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');

if(app.get("env") === "development") {
    var logFilePath = "logs/development.log"
} else {
    var logFilePath = "logs/production.log"
}
var accessLogStream = fs.createWriteStream(path.join(__dirname, logFilePath), {flags: "a"});

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

firebase.initializeApp({
    serviceAccount: "../credentials/RiJonTtak-308ee4a7684d.json",
    databaseURL: "https://rijonttak.firebaseio.com"
});

var cron = require("./lib/updateCurrency")();
cron.start();

var port = process.env.PORT || 3000;

var userRouter = require('./routes/user')(app, cache);
// TODO url 정규표현식 처리하기
app.use('/api/users?', userRouter);

var currencyRouter = require('./routes/currency')(app, cache);
app.use('/api/currency', currencyRouter);

var noteRouter = require('./routes/note')(app);
app.use('/api/notes', noteRouter);

var floorRouter = require('./routes/floor')(app, cache);
app.use('/api/floors?', floorRouter);

app.use(function(req, res){
    res.status(404).end();
});

var server = app.listen(port, function(){
    console.log('Example app listening on port ' + port);
});
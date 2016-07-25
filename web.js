var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io');
var moment = require("moment");


var pauseFunc = require('./services/pause');
var playFunc = require('./services/play');


server.listen(7000);

//Use to serve up static files within public directory
app.use(express.static(__dirname + "/public"))

//Points to admin.html instead of the default index.html
app.use('/admin', express.static(__dirname + "/public", { index: 'admin.html' }))

var socket = io.listen(server);

socket.configure(function () {
  socket.set("transports", ["xhr-polling"])
  socket.set("polling duration", 10)
  socket.set("log level", 1)
});


socket.sockets.on("connection", function (socket) {
 
  socket.on('startTime', function (timeValue) {

    playFunc.setSocket(socket); 
    playFunc.setAsNewRequest();
    
    playFunc.inputTimeValidation();
    playFunc.updateClock(timeValue);
    playFunc.activateStartInterval();

  });

  socket.on('pauseTime', function () {
    //stop timer 
    playFunc.clearStartTimeInterval();
       
    pauseFunc.setSocket(this);
    pauseFunc.pauseTimeClock();    
    pauseFunc.activatePauseInterval();
    pauseFunc.resetClockToZero();
    
  })

  socket.on('restartTime', function () {
    var inputTimeValue = playFunc.getInputStartTime();
    var pausedTime = pauseFunc.getPausedTime();
    var restartTimeVal = moment(inputTimeValue);   
    
    restartTimeVal.add(pausedTime.hour(), 'hours');
    restartTimeVal.add(pausedTime.minute(), 'minutes');

    //parse momentjs object to Date.valueOf object in milliseconds
    var restartTime = restartTimeVal.utc().valueOf();

    socket.emit('restartClock', restartTime);
    
    pauseFunc.clearPauseInterval();

  })

  socket.on('stopTime', function () {
    
    playFunc.clearStartTimeInterval();
    pauseFunc.resetClockToZero();
    pauseFunc.clearPauseInterval();

  });

});












var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io');
var moment = require("moment");


var pauseFunc = require('./services/pause');
var playFunc = require('./services/play');

// Server 
var port = 80;
server.listen(port, function () {
  console.log('Server started, listening to port ' + port);
});

//Use to serve up static files within public directory
app.use(express.static(__dirname + "/public"))

//Points to admin.html instead of the default index.html
app.use('/admin', express.static(__dirname + "/public", { index: 'admin.html' }))

var outterSocket = io.listen(server, {log: false});


outterSocket.sockets.on("connection", function (socket) {
  
  //initialize 
  playFunc.setSocket(outterSocket);
  pauseFunc.setSocket(outterSocket);  
  
  socket.on('startTime', function (timeValue) {
   
    playFunc.setAsNewRequest(socket);
    playFunc.updateClock(timeValue);
    playFunc.activateStartInterval();
    
  });

  socket.on('pauseTime', function () {
    
    //stop timer    
    playFunc.clearStartTimeInterval();
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
    
    //reset pause timer  
    pauseFunc.clearPauseInterval();

  })

  socket.on('stopTime', function () {
    
    playFunc.clearStartTimeInterval();
    playFunc.resetClockToZero();
    pauseFunc.clearPauseInterval();

  });

});












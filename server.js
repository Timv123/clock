var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io');
var moment = require("moment");


var pauseFunc = require('./services/pause');
var playFunc = require('./services/play');
var Stopwatch = require('./services/stopwatch');

// Server 
var port = 80;
server.listen(port, function () {
  console.log('Server started, listening to port ' + port);
});

//Use to serve up static files within public directory
app.use(express.static(__dirname + "/public"))

//Points to admin.html instead of the default index.html
app.use('/admin', express.static(__dirname + "/public", { index: 'admin.html' }))

var outterSocket = io.listen(server, { log: false });

var stopClockTimer = new Stopwatch();

outterSocket.sockets.on("connection", function (socket) {

  //init
  stopClockTimer.setSocket(outterSocket);

  socket.on('play', function (timeValue) {
    stopClockTimer.playing(timeValue);
  });

  socket.on('stop', function (timeValue) {
    stopClockTimer.stopping(timeValue);
  })

  socket.on('pause', function (timeValue) {
    stopClockTimer.pausing(timeValue);
  })

});












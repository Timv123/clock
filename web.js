var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io');
var moment = require("moment");


server.listen(7000);

if (process.env.NODE_INSPECTOR) {

}

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

  var startTimeinterval, pauseTimeinterval, countDownTime, pausedTime, startTime;

  if (socketId.length > 1) {
    socket.namespace.sockets[socketId[0].id].disconnect();
    socketId.shift();
    socketId.push(socket);
  }
  
  socket.on('startTime', function (timeValue) {
    var counter = 0;
    startTime = timeValue;

    function updateClock() {
      var t = getTimeRemaining(timeValue);
      //reset when time runs out
      if (t.total <= 0) {
        clearInterval(startTimeinterval);
      }
      countDownTime = moment().hour(t.hours).minute(t.minutes).second(counter--);
      //format time for display                    
      socket.broadcast.emit("currentTime", { time: moment().format('HH:mm:ss') });
      socket.broadcast.emit("countDown", { time: countDownTime.format('HH:mm:ss') });
      socket.broadcast.emit("startTime", { time: moment(timeValue).format('HH:mm') });

    }
    startTimeinterval = setInterval(updateClock, 1000);
  });

  socket.on('pauseTime', function () {
    //stop broadcasting countDown time
    clearInterval(startTimeinterval);

    var counter = 0;

    function pauseTimeClock() {
      pausedTime = moment().hour(0).minute(0).second(counter++);
      socket.emit("pauseTimeClock", { time: pausedTime.format('HH:mm:ss') });
      socket.broadcast.emit("countDown", { time: moment().hour(0).minute(0).second(0).format('HH:mm:ss') });
      socket.broadcast.emit("startTime", { time: moment().hour(0).minute(0).format('HH:mm') });
    }
    pauseTimeinterval = setInterval(pauseTimeClock, 1000);

  })

  socket.on('restartTime', function () {

    var startTimeObj = moment(startTime);
    startTimeObj.add(pausedTime.hour(), 'hours');
    startTimeObj.add(pausedTime.minute(), 'minutes');

    //parse momentjs object to Date.valueOf object in milliseconds
    var restartValue = startTimeObj.utc().valueOf();

    socket.emit('replayClock', restartValue);
    clearInterval(pauseTimeinterval);

  })

  socket.on('stopTime', function () {
    console.log('Got stopped!');
    clearInterval(startTimeinterval);
    clearInterval(pauseTimeinterval);
  });

});

function RemoveListener(socket) {

  var socketId = [];

  if (socketId.length > 1) {
    socket.namespace.sockets[socketId[0].id].disconnect();
    socketId.shift();
    socketId.push(socket);
  }  

}

function getTimeRemaining(endtime) {
  var t = endtime - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));

  //format hour, minute, second with "0" added
  if (hours.toString().length < 2 || hours < 1) {
    hours = "0" + hours;
  }
  if (minutes.toString().length < 2) {
    minutes = "0" + minutes;
  }
  if (seconds.toString().length < 2) {
    seconds = "0" + seconds;
  }

  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}









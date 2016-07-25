var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io');
var moment = require("moment");


var pauseFunction = require('./services/pause');

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

var oldSocket, startTimeinterval;

socket.sockets.on("connection", function (socket) {
 
   var pauseTimeinterval, countDownTime, pausedTime, startTime;


  socket.on('startTime', function (timeValue) {
    
    checkValidTime(socket, timeValue);
    startTime = timeValue;
    
    if (oldSocket !== socket.id) {
     clearInterval(startTimeinterval);
     console.log('oldsocket' + oldSocket);
     console.log('socketid' + socket.id);
   }

    oldSocket = socket.id;

    function updateClock() {
      var t = getTimeRemaining(timeValue);
      //reset when time runs out
      if (t.total <= 0) {
        clearInterval(startTimeinterval);
        console.log(t.minute);
      }
      countDownTime = moment().hour(t.hours).minute(t.minutes).second(t.seconds --);
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
       
    pauseFunction.setSocket(this);
    pauseFunction.pauseTimeClock();    
    pauseFunction.activatePauseInterval();
    pauseFunction.resetClock();
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



function checkValidTime (socket, timeValue){
   var currentTime = Date.parse(new Date());
   var validTime = timeValue - currentTime;
   
    if(validTime < 0){
      socket.emit('invalidTimeAlert');
    }
};

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









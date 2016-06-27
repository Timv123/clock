var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io');
var moment  = require("moment");


server.listen(80);

//Use to serve up static files within public directory
app.use(express.static(__dirname + "/public"))

//Points to admin.html instead of the default index.html
app.use('/admin',express.static(__dirname + "/public",{index: 'admin.html'}))


var socket = io.listen(server)
socket.configure(function () { 
  socket.set("transports", ["xhr-polling"]) 
  socket.set("polling duration", 10) 
  socket.set("log level", 1)
})

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

socket.sockets.on("connection", function (socket) {

  socket.on('countDown',function(data){

   console.log('in the countDown');
  // seperate the incoming hours and minutes
  var timeStrArray = data.split(":");
  var hour = timeStrArray[0];
  var minute = timeStrArray[1];

  //add hours and minutes to current time
  var deadline = new Date(Date.parse(new Date()) + (hour * 60 * 60 * 1000) + (1000 * 60 * minute));


  function updateClock() {   

    var t = getTimeRemaining(deadline);
    if (t.total <= 0) {
      clearInterval(timeinterval);
    }

    var displayTime = moment();
        displayTime.hours(t.hours);
        displayTime.minutes(t.minutes);
        displayTime.seconds(t.seconds);

    console.log('in the ' + displayTime.toDate());

    socket.broadcast.emit("countDown", {time: moment(displayTime.toDate()).format('hh:mm:ss')});

  }
    //updateClock();
    var timeinterval = setInterval(updateClock, 1000);
	});

  socket.on('startTime',function(data){
    console.log('in the startTime ' + data);
    socket.broadcast.emit("startTime", {time: moment(data, 'hhmmss').format('HH:mm')});
  });
	
})








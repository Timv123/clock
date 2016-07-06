var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io');
var moment = require("moment");


server.listen(80);

//Use to serve up static files within public directory
app.use(express.static(__dirname + "/public"))

//Points to admin.html instead of the default index.html
app.use('/admin', express.static(__dirname + "/public", { index: 'admin.html' }))


var socket = io.listen(server);

socket.configure(function () {
  socket.set("transports", ["xhr-polling"])
  socket.set("polling duration", 10)
  socket.set("log level", 1)
})

socket.sockets.on("connection", function (socket) {

  var timeinterval;
  var countDownTime;

  socket.on('startTime', function (data) {

    // seperate the incoming hours and minutes
    var timeStrArray = data.split(":");
    var inputHour = timeStrArray[0];
    var inputMinute = timeStrArray[1];


    //difference in time of input and current time
    var diffInHours = inputHour - moment().hour();
    var diffInMinutes = inputMinute - moment().minute();

    //add input time to momemt.js time  
    var endtime = moment();
    endtime.add(diffInHours, 'hours');
    endtime.add(diffInMinutes, 'minutes');

    function updateClock() {
      var t = getTimeRemaining(endtime);
      //reset when time runs out
      if (t.total <= 0) {
        clearInterval(timeinterval);
      }

      //format time for display                    
      countDownTime = t.hours + ":" + t.minutes + ":" + t.seconds;
      socket.broadcast.emit("currentTime", { time: moment().format('HH:mm:ss') });
      socket.broadcast.emit("countDown", { time: countDownTime });
      socket.broadcast.emit("startTime", { time: moment(data, 'hhmmss').format('HH:mm') });

    }

    timeinterval = setInterval(updateClock, 1000);
  });

  socket.on('pauseTime', function () {
    //stop broadcasting countDown time
    clearInterval(timeinterval);
    
    var pausedTime = moment();

    function pauseTimeClock() {
     
      var timeDiffHour = moment().hour() - pausedTime.hour();
      var timeDiffMinute = moment().minute() - pausedTime.minute();
      var timeDiffSec = moment().second();

      var displayTime = timeDiffHour + ":" + timeDiffMinute + ":" + timeDiffSec;

      socket.emit("pauseTimeClock", { time: moment(displayTime, 'hhmm').format('HH:mm') });

      console.log(timeDiffHour);
      console.log(timeDiffMinute);
    }

    setInterval(pauseTimeClock, 1000);

  })

});

function pausingTime() {


}

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
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









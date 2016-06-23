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


//endpoint router to set clock time
app.get('/settime', function (req, res) {
  res.send('GET request to homepage');
});


//endpoint router to set clock time
app.get('/pause/:id', function (req, res) {
  var id = req.params.id;
  res.send('id: ' + console.log(id));
});


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

  socket.on('tick',function(data){

  var timeStrArray = data.split(":");
  var hour = timeStrArray[0];
  var minute = timeStrArray[1];

  var deadline = new Date(Date.parse(new Date()) + (hour * 60 * 60 * 1000) + (1000 * 60 * minute));

  function updateClock() {
    
    var t = getTimeRemaining(deadline);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }

    

    //var dd = new Date(Date.parse(data1));
    console.log('in the hour ' + hour);
    console.log('in the hours ' + t.hours);
    console.log('in the minute ' + t.minutes);
    console.log('in the moment ' + t.seconds);
    console.log('in the dead ' + deadline);

    //socket.broadcast.emit("tick", {time: moment(data1, 'hmm').format('HH:mm')});

  }
    //updateClock();
    var timeinterval = setInterval(updateClock, 1000);
	});

  socket.on('countDown',function(data){
    console.log('in the countdown ' + data);
    socket.broadcast.emit("countdown", {time: moment(data, 'hmm').format('HH:mm')});
  });
	
})








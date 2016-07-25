var clockUtil = require('./util');

function pause() {
  
  var counter = 0;
  var pausedTime;
  var socket ;
  
  function activatePauseInterval (){
    console.log(counter);
    setInterval(pauseTimeClock, 1000);
  }
  
  function setSocket(sock){
    socket = sock;
  }
  
  function getPausedTime(){
    return pausedTime;
  }
  
  function resetClock(){
     clockUtil().resetClock(socket); 	  
  }
  
  function pauseTimeClock() {
    pausedTime = moment().hour(0).minute(0).second(counter++);
    socket.emit("pauseTimeClock", { time: pausedTime.format('HH:mm:ss') });	
  }
  
  return {
    pauseTimeClock: pauseTimeClock,
    setSocket : setSocket,
    activatePauseInterval : activatePauseInterval,
	  resetClock : resetClock,
    getPausedTime : getPausedTime
  }
  
};

module.exports = pause();

var clockUtil = require('./util');

function pause() {
  
  var counter = 0;
  var pausedTime;
  var pausedTimeInterval;
  var socket ;
  
  function activatePauseInterval (){
    pausedTimeInterval = setInterval(pauseTimeClock, 1000);
  }
  
  function clearPauseInterval(){  
    counter = 0;
    pausedTime = 0;
    
    resetPauseTimer();
    clearInterval (pausedTimeInterval);
  }
  
  function setSocket(sock){
    socket = sock;
  }
  
  function getPausedTime(){
    return pausedTime;
  }
  
  function resetClockToZero(){
     clockUtil.resetClock(socket); 	  
  }
  
  function pauseTimeClock() {
    pausedTime = moment().hour(0).minute(0).second(counter ++);
    socket.emit("pauseTimeClock", { time: pausedTime.format('HH:mm:ss') });	
  }
  
  function resetPauseTimer() {
    socket.emit("pauseTimeClock", { time: moment().hour(0).minute(0).second(0).format('HH:mm:ss') });

  }
    
  
  return {
    pauseTimeClock        : pauseTimeClock,
    setSocket             : setSocket,
    activatePauseInterval : activatePauseInterval,
    clearPauseInterval    : clearPauseInterval,
	  resetClockToZero      : resetClockToZero,
    resetPauseTimer       : resetPauseTimer,
    getPausedTime         : getPausedTime
  }
  
};

module.exports = pause();

var clockUtil = require('../services/util');
var pauseFunc = require('../services/pause');
var playFunc = require('../services/play');

function Play() {
     this.outterSocket;

    this.play = function (stopwatch) {
        this.stopwatch = stopwatch;
        this.outterSocket = this.stopwatch.getSocket();
        this.outterSocket.sockets.emit('inPlayState');
    }

    this.pause = function (stopwatch) {
        //init
        this.stopwatch = stopwatch;
        this.outterSocket = this.stopwatch.getSocket();    
        pauseFunc.setSocket(this.outterSocket);
        
        //set start time and pause time to zero
        playFunc.clearStartTimeInterval();
        
        //run pause functions
        pauseFunc.pauseTimeClock();    
        pauseFunc.activatePauseInterval();
        pauseFunc.resetClockToZero();
    }

    this.stop = function (stopwatch) {
        this.stopwatch = stopwatch;
        this.stopwatch.changeState(this.stopwatch.getStopState());
        socket.emit('stopTime');
    }

};

module.exports = Play;




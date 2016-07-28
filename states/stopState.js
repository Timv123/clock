var clockUtil = require('../services/util');
var pauseFunc = require('../services/pause');
var playFunc = require('../services/play');


function Stop() {
    
    this.outterSocket;
    
    this.stop = function () {
       // $('#notActive').modal('show');
    }

    this.play = function (stopwatch) {
        
        this.stopwatch = stopwatch;
        this.startTime = this.stopwatch.getStartTime();
        this.isTimeValid = clockUtil.isTimeValid(this.startTime);
        this.outterSocket = this.stopwatch.getSocket();
        
        if (!this.isTimeValid) {
            this.outterSocket.sockets.emit('invalidTimeAlert');
        } 
        else {  
            
           //when done state change 
           this.stopwatch.changeState(this.stopwatch.getPlayState()); 
                      
           // playFunc.setAsNewRequest(socket);
            playFunc.setSocket(this.outterSocket);
            playFunc.updateClock(this.startTime);
            playFunc.activateStartInterval();    
                        
        }
    }

    this.pause = function () {
        //$('#notActive').modal('show');
    }
    
    this.checkTimeValidation = function(){
        
    } 
};

module.exports = Stop;
var clockUtil = require('../services/util');

function Stop() {
    
    this.socket;
    
    this.stop = function () {
       // $('#notActive').modal('show');
    }

    this.play = function (stopwatch) {
        
        this.stopwatch = stopwatch;
        this.startTime = this.stopwatch.getStartTime();
        this.isTimeValid = clockUtil.isTimeValid(this.startTime);
        this.socket = this.stopwatch.getSocket();
        
        if (!this.isTimeValid) {
            this.socket.sockets.emit('invalidTimeAlert');
        } 
        else {  
                
            this.stopwatch.changeState(this.stopwatch.getPlayState());           
        }
    }

    this.pause = function () {
        //$('#notActive').modal('show');
    }
    
    this.checkTimeValidation = function(){
        
    } 
};

module.exports = Stop;
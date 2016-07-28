function Play() {
    var startTimeInput, inputTime, dateObj;

    this.play = function (stopwatch) {
       // $('#inPlay').modal('show');
       console.log('in playing state');
    }

    this.pause = function (stopwatch) {
        this.stopwatch = stopwatch;
        this.stopwatch.changeState(this.stopwatch.getPauseState());
        socket.emit('pauseTime');
    }

    this.stop = function (stopwatch) {
        this.stopwatch = stopwatch;
        this.stopwatch.changeState(this.stopwatch.getStopState());
        socket.emit('stopTime');
    }

};

module.exports = Play;




function Pause() {

    this.play = function (stopwatch) {
        this.stopwatch = stopwatch;
        this.stopwatch.changeState(this.stopwatch.getPlayState());
        socket.emit('restartTime');
    }

    this.pause = function () {
        $('#notActive').modal('show');
    }

    this.stop = function (stopwatch) {
        this.stopwatch = stopwatch;
        this.stopwatch.changeState(this.stopwatch.getStopState());
        socket.emit('stopTime');
    }
};

module.exports = Pause;
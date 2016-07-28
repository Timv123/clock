var clockUtil = require('../services/util');
var pauseFunc = require('../services/pause');
var playFunc = require('../services/play');

function Pause() {

    this.play = function (stopwatch) {
        this.stopwatch = stopwatch;  
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
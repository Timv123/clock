$(function () {

    //establish websocket connection
    var socket = io.connect('http://localhost');
    var stopWatchClock = new stopwatch();


    $('.startTime').clockpicker({
        donetext: 'Done'
    });

    $('#stopButton').on('click', function () {
        stopWatchClock.stopping();
    });

    $('#playButton').on('click', function () {
        stopWatchClock.playing();
    });

    $('#pauseButton').on('click', function () {
        stopWatchClock.pausing();
    });


    socket.on('pauseTimeClock', function (data) {
        stopWatchClock.setPausedTime(data.time);
        $('.pauseTime').html(data.time.replace(/(\d)/g, '<span>$1</span>'))
        console.log(stopWatchClock.pausedTime);
    });

    function stopwatch() {

        this.currentState = new Stop(this);
        this.pausedTime;

        this.changeState = function (state) {
            this.currentState = state;
        };

        this.stopping = function () {
            this.currentState.stop(this);
        }

        this.playing = function () {
            this.currentState.play(this);
        }

        this.pausing = function () {
            this.currentState.pause(this);
        }

        this.setPausedTime = function(pauseTime) {
            this.pausedTime = pauseTime
        }

        this.getPlayState = function () {
            return new Play(this);
        }

        this.getStopState = function () {
            return new Stop(this);
        }

        this.getPauseState = function () {
            return new Pause(this);
        }

    };

    function Play() {
        var startTimeInput, startTime;
        this.initialize = function () {
            startTimeInput = $('.startTime').clockpicker().find('input');
            startTime = startTimeInput[0].value;
        };

        this.play = function (stopwatch) {
            this.stopwatch = stopwatch;
            this.initialize();
            this.stopwatch.changeState(this.stopwatch.getPlayState());

            if (startTime == "") {
                $('#emptyField').modal('show');
            }
            else {
                socket.emit('startTime', startTime);
            }
        }

        this.pause = function (stopwatch) {
            this.stopwatch = stopwatch;

            socket.emit('pauseTime');

            console.log('outside of puase');
            this.stopwatch.changeState(this.stopwatch.getPauseState());
        }

    };

    function Stop() {
        this.stop = function () {
            $('#myModal').modal('show');
        }

        this.play = function (stopwatch) {
            stopwatch.changeState(stopwatch.getPlayState());
            stopwatch.playing();
        }
        
         this.pause = function () {
            console.log('STOP :pausedTime funtion' );
        }
    };

    function Pause() {
        var pausedTime;
    
        this.play = function () {
            socket.emit('startTime', stopWatchClock.pausedTime);
        }

        this.pause = function () {
            console.log('pausedTime funtion' + pausedTime);
        }
    };

});



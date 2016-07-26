$(function() {

    //establish websocket connection
    var socket = io.connect('http://localhost:7000');
    var stopWatchClock = new stopwatch();
    console.log(socket);
    
    
    /************************************************************************************************
     ***  jQuery event listeners *******************************************************************
     ************************************************************************************************/

    $('.startTime').clockpicker({
        donetext: 'Done'
    });

    $('#stopButton').on('click', function() {
        stopWatchClock.stopping();
    });

    $('#playButton').on('click', function() {
        stopWatchClock.playing();
    });

    $('#pauseButton').on('click', function() {
        stopWatchClock.pausing();
    });


    /************************************************************************************************
     ***  socket event listeners  *******************************************************************
     ************************************************************************************************/
     
    socket.on('pauseTimeClock', function (data) {
        stopWatchClock.setPausedTime(data.time);
        $('.pauseTime').fadeIn('slow').html(data.time.replace(/(\d)/g, '<span>$1</span>'))
    });

    socket.on('restartClock', function (data) {
        socket.emit('startTime', data);
    });

    socket.on('invalidTimeAlert', function () {
        console.log('in valid time check');
        $('#timeError').modal('show');
    });

    socket.on('currentTime', function (data) {
        console.log(data)
        $('.currentTime').html(data.time.replace(/(\d)/g, '<span>$1</span>'))
    });


    socket.on('startTime', function (data) {
        console.log(data)
        $('.startTime').html(data.time.replace(/(\d)/g, '<span>$1</span>'))
    });


    socket.on('countDown', function (data) {
        console.log(data)
        $('.countdown').html(data.time.replace(/(\d)/g, '<span>$1</span>'))
    });
 

    /************************************************************************************************
     ***  Clock Play, Pause, Stop states  ***********************************************************
     ************************************************************************************************/
     
    function getUserTimeInput() {
        var userInputStartTime = $('.startTime').clockpicker().find('input');
        return userInputStartTime;
    }

    function parseTimeInputToDateObj(time) {

        var timeStrArray = time[0].value.split(":");
        var inputHour = parseInt(timeStrArray[0]);
        var inputMinute = parseInt(timeStrArray[1]);

        var date = new Date();
        date.setHours(inputHour);
        date.setMinutes(inputMinute);

        return date;
    }

    function addToCurrentTime(crntTime, addTime) {
        this.crntTime = crntTime;
        this.addTime = addTime;
    }

    function isTimeValid() {
        var inputTime = getUserTimeInput();
        var parseTimeInput = parseTimeInputToDateObj(inputTime).getTime();
        var currentTime = new Date().getTime();

        if (parseTimeInput > currentTime) {
            return true;
        } else return false;
    }

    function stopwatch() {
        this.currentState = new Stop(this);
        this.pausedTime;
        this.startTime;

        this.changeState = function(state) {
            this.currentState = state;
        };

        this.stopping = function() {
            this.currentState.stop(this);
        }

        this.playing = function() {
            this.currentState.play(this);
        }

        this.pausing = function() {
            this.currentState.pause(this);
        }

        this.setPausedTime = function(pauseTime) {
            this.pausedTime = pauseTime
        }

        this.setStartTime = function(startTime) {
            this.startTime = startTime
        }

        this.getPlayState = function() {
            return new Play(this);
        }

        this.getStopState = function() {
            return new Stop(this);
        }

        this.getPauseState = function() {
            return new Pause(this);
        }
    };

    function Play() {
        var startTimeInput, inputTime, dateObj;

        this.play = function(stopwatch) {
            $('#inPlay').modal('show');
        }

        this.pause = function(stopwatch) {
            this.stopwatch = stopwatch;
            this.stopwatch.changeState(this.stopwatch.getPauseState());
            socket.emit('pauseTime');
        }

        this.stop = function(stopwatch) {
            this.stopwatch = stopwatch;
            this.stopwatch.changeState(this.stopwatch.getStopState());
            socket.emit('stopTime');
        }

    };

    function Stop() {
        this.initialize = function() {
            inputTime = getUserTimeInput();
            dateObj = parseTimeInputToDateObj(inputTime);
        };

        this.stop = function() {
            $('#notActive').modal('show');
        }

        this.play = function(stopwatch) {
            this.initialize();
            this.stopwatch = stopwatch;
           
            var isTimeValidd = isTimeValid();          
            if (!isTimeValidd) {
                $('#timeError').modal('show');
            } else {
                if (inputTime[0].value == "") {
                    $('#emptyField').modal('show');
                } else {
                    socket.emit('startTime', dateObj.valueOf());
                    this.stopwatch.changeState(this.stopwatch.getPlayState());
                }
            }
        }
        
        this.pause = function() {
            $('#notActive').modal('show');
        }
    };

    function Pause() {

        this.play = function(stopwatch) {
            this.stopwatch = stopwatch;
            this.stopwatch.changeState(this.stopwatch.getPlayState());
            socket.emit('restartTime');
        }

        this.pause = function() {
            $('#notActive').modal('show');
        }

        this.stop = function(stopwatch) {
            this.stopwatch = stopwatch;
            this.stopwatch.changeState(this.stopwatch.getStopState());
            socket.emit('stopTime');
        }
    };

});
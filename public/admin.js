$(function () {

    //establish websocket connection
    var socket = io.connect('http://localhost');
    var stopWatchClock = new stopwatch();
    console.log(socket);

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
        $('.pauseTime').fadeIn('slow').html(data.time.replace(/(\d)/g, '<span>$1</span>'))
        console.log(stopWatchClock.pausedTime);
    });
    
    socket.on('replayClock', function (data) {
         socket.emit('startTime', data);
    });
    
     socket.on('invalidTimeAlert', function () {
         $('#timeError').modal('show');
    });
    function getUserTimeInput (){
       var userInputStartTime = $('.startTime').clockpicker().find('input');      
       return userInputStartTime;
    }
    
    function parseTimeInputToDateObj (time){
   
        var timeStrArray = time[0].value.split(":");
        var inputHour = parseInt(timeStrArray[0]);
        var inputMinute = parseInt(timeStrArray[1]);       
        
        var date = new Date();
        date.setHours(inputHour);
        date.setMinutes(inputMinute);
    
        return date;
    }
    
    function addToCurrentTime (crntTime, addTime) {
        
        this.crntTime = crntTime;
        this.addTime = addTime;      
    }

    function stopwatch() {

        this.currentState = new Stop(this);
        this.pausedTime;
        this.startTime;

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
        
         this.setStartTime = function(startTime) {
            this.startTime = startTime
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
        var startTimeInput, inputTime,dateObj;
        
        this.play = function (stopwatch) {
             $('#inPlay').modal('show');
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
             console.log('stopping');
        }

    };

    function Stop() {
       

        this.initialize = function () {
            inputTime = getUserTimeInput();
            dateObj = parseTimeInputToDateObj(inputTime);  
        };
        
         this.stop = function () {
             $('#notActive').modal('show');
        }

        this.play = function (stopwatch) {
            this.initialize();
            this.stopwatch = stopwatch;
            this.stopwatch.changeState(this.stopwatch.getPlayState());

            if (inputTime[0].value == "") {
                $('#emptyField').modal('show');
            }
            else {
                console.log(dateObj.getMinutes());
                socket.emit('startTime', dateObj.valueOf());
            }
        }
        
         this.pause = function () {
              $('#notActive').modal('show');
        }
    };

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
             console.log('stopping');
        }
    };

});



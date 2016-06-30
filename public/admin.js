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
        
        this.setPausedTime = function(pauseTime){
            this.pausedTime = pauseTime;
        }
        this.getPausedTime = function(){
            return pausedTime;
        }
        
        this.getPlayState = function(){
            return new Play(this);
        }
        
        this.getStopState = function (){
            return new Stop(this);
        }

        this.getPauseState = function() {
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
        
        this.pause = function (stopwatch){
             socket.emit('pauseTime');  
        }

    };

    function Stop() {
        this.stop = function () {
            $('#myModal').modal('show');
        }
        
        this.play = function (stopwatch){       
                           
           stopwatch.changeState(stopwatch.getPlayState());
           stopwatch.playing();
        }
    };

    function Pause() {
        var pausedTime;
        this.initialize = function (callback) {
                      
            socket.on('countDown',function(data){
                stopWatchClock.setPausedTime = data.time;
                console.log('in paused time' + stopWatchClock.getPausedTime);    
                
                 $('.pauseTime').html(data.time.replace(/(\d)/g, '<span>$1</span>'))                       
               // socket.emit('pausedTime');                        
            });
            
             
            
            console.log('out of pausedTime'+ pausedTime);
        }
        this.pause = function () {
            this.initialize();
            console.log('pausedTime funtion' + pausedTime);
        }
    };

});



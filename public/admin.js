$(function () {

    //establish websocket connection
    var socket = io.connect('http://localhost');
    
    

    $('.startTime').clockpicker({
        donetext: 'Done'
    });


    $('.countDown').clockpicker({
        donetext: 'Done'
    });
    
    
    $('#stopButton').on('click', function() {
        
        var stop = new stopwatch();
        
        stop.start();
    });
    
    $('#playButton').on('click', function() {
        
        var stop = new stopwatch();
        
        stop.start();
    });
    
    $('#pauseButton').on('click', function() {
        
        var stop = new stopwatch();
        
        stop.start();
    });

  
    function stopwatch() {

        var currentState = new Play(this);

        this.change = function (state) {
            this.currentState = state;
        };

        this.start = function () {
            currentState.initialize();
            currentState.execute();
        }

    };

    function Play(state) {
        
        this.state = state;
        var startTimeInput, startTime, countdownInput, countTime;
        
        this.initialize = function(){
            
             startTimeInput = $('.startTime').clockpicker().find('input');
             startTime = startTimeInput[0].value;
             countdownInput = $('.countDown').clockpicker().find('input');
             countTime = countdownInput[0].value;
            
        };
        
        
        this.execute = function () {
            
            if((startTime || countTime) == "" ){
                  $('#emptyField').modal('show');
            }
            else{
                 socket.emit('startTime', startTime);
                 socket.emit('countDown', countTime);
            }
                
            
        }

    };
    
    function Stop(state) {
        this.state = state;

        this.execute = function () {
            $('#myModal').modal('show');
        }

    };

    function Pause(state) {
        this.state = state;

        this.execute = function () {
            console.log('execute puase');
        }
    };


});



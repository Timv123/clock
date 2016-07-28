$(function() {

    //establish websocket connection
    var socket = io.connect('http://localhost');
    
    /************************************************************************************************
     ***  jQuery event listeners *******************************************************************
     ************************************************************************************************/

    $('.startTime').clockpicker({
        donetext: 'Done'
    });

    $('#stopButton').on('click', function() {
        socket.emit('stop');
    });

    $('#playButton').on('click', function() {
        
        var inputTime = parseTimeInputToDateObj(getUserTimeInput());
         socket.emit('play',inputTime);
    });

    $('#pauseButton').on('click', function() {
         socket.emit('pause');
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


    socket.on('startTime', function (data) {
        $('.startTimeClock').html(data.time.replace(/(\d)/g, '<span>$1</span>'))
    });


    socket.on('countDown', function (data) {
        $('.countdownClock').html(data.time.replace(/(\d)/g, '<span>$1</span>'))
    });
    
     socket.on('currentTime', function (data) {
        $('.currentTimeClock').html(data.time.replace(/(\d)/g, '<span>$1</span>'))
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

    
    

});
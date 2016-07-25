var clockUtil = require('./util');


function playFuntion() {

    var countDownTime, 
        startTimeinterval, 
        inputTimeValue, 
        socket, 
        oldSocket;

    function setSocket(sock) {
        socket = sock;
    }

    function getStartTimeInterval() {
        return startTimeinterval;
    }

    function getInputStartTime() {
        return inputTimeValue;
    }

    function inputTimeValidation (timeValue){
        
        var t = clockUtil.getTimeRemaining(timeValue);    
        
        if(t.total <= 0){
            socket.broadcast.emit('invalidTimeAlert');
            console.log('time valid');
        }
        
    }
    
    function activateStartInterval() {
        startTimeinterval = setInterval(function () {
            updateClock(inputTimeValue)
        }, 1000);
    }

    function clearStartTimeInterval() {
        try {
             clearInterval(startTimeinterval);
        } catch (error) {
            console.log('activateStartInterval is not set : error message ' + error);
        }
    }

    function setAsNewRequest() {
        if (oldSocket !== socket.id) {
           clearStartTimeInterval();
        }
        oldSocket = socket.id;
    }


    function updateClock(timeValue) {
        inputTimeValue = timeValue;
        var t = clockUtil.getTimeRemaining(inputTimeValue);
           
        //reset when time runs out
        if (t.total <= 0) {
            clearStartTimeInterval();
        }
        
        //format time for display 
        countDownTime = moment().hour(t.hours).minute(t.minutes).second(t.seconds--);
                     
        socket.broadcast.emit("currentTime", {time: moment().format('HH:mm:ss')});
        socket.broadcast.emit("countDown", {time: countDownTime.format('HH:mm:ss')});
        socket.broadcast.emit("startTime", {time: moment(inputTimeValue).format('HH:mm')});

    }

    return {
        activateStartInterval  : activateStartInterval,
        clearStartTimeInterval : clearStartTimeInterval,
        updateClock            : updateClock,
        setSocket              : setSocket,
        getStartTimeInterval   : getStartTimeInterval,
        setAsNewRequest        : setAsNewRequest,
        getInputStartTime      : getInputStartTime,
        inputTimeValidation    : inputTimeValidation
    }


}

module.exports = playFuntion();
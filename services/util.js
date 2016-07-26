
function util() {
    

   
    function resetClock(socket) {
        socket.broadcast.emit("countDown", { time: moment().hour(0).minute(0).second(0).format('HH:mm:ss') });
        socket.broadcast.emit("startTime", { time: moment().hour(0).minute(0).format('HH:mm') });
    }
   
    function disConnectSocket (socket){      
        if (socketId.length > 1) {
            socket.namespace.sockets[socketId[0].id].disconnect();
            socketId.shift();
            addSocketToArray(socket);
        }
    }
    
    function getTimeRemaining(endtime) {
        var t = endtime - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));

        //format hour, minute, second with "0" added
        if (hours.toString().length < 2 || hours < 1) {
            hours = "0" + hours;
        }
        if (minutes.toString().length < 2) {
            minutes = "0" + minutes;
        }
        if (seconds.toString().length < 2) {
            seconds = "0" + seconds;
        }

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }
    }
     
    return {
        resetClock : resetClock,
        getTimeRemaining : getTimeRemaining    }

}

module.exports = util();

function util() {
    
    var socketId = [];
   
    function resetClock(socket) {
        socket.broadcast.emit("countDown", { time: moment().hour(0).minute(0).second(0).format('HH:mm:ss') });
        socket.broadcast.emit("startTime", { time: moment().hour(0).minute(0).format('HH:mm') });
    }
    
    function addSocketToArray(socket){
        socketId.push(socket);
    }
    
    function disConnectSocket (socket){      
        if (socketId.length > 1) {
            socket.namespace.sockets[socketId[0].id].disconnect();
            socketId.shift();
            addSocketToArray(socket);
        }
    }
     
    return {
        resetClock : resetClock,
        removeSocketListener : removeSocketListener      
    }

}

module.exports = util;
$(function() {

  //establish websocket connection
  var socket = io.connect('http://localhost');   

  $('.startTime').clockpicker({ 
                    donetext: 'Done',
                        init: function() { 
                            console.log("colorpicker initiated");
                        },                       
                        afterDone: function() {
                            var input = $('.startTime').clockpicker().find('input');
                            var time = input[0].value;
                            socket.emit('tick', time);
                        }
 
               }); 



 $('.countDown').clockpicker({ 
                    donetext: 'Done',
                        init: function() { 
                            console.log("countDown initiated");
                        },                       
                        afterDone: function() {
                            var input = $('.countDown').clockpicker().find('input');
                            var time = input[0].value;
                            socket.emit('countDown', time);
                            console.log("countDown " + time);
                        }
 
               }); 
});



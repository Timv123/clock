var PlayState = require('../states/playState');
var StopState = require('../states/stopState');
var PauseState = require('../states/pauseState');

var clockUtil = require('./util');


function stopwatch() {
        this.currentState = new StopState(this);
        this.pausedTime;
        this.startTime;
        this.socket;

        this.changeState = function(state) {
            this.currentState = state;
        };

        this.stopping = function() {
            this.currentState.stop(this);
        }

        this.playing = function(time) {
            this.setStartTime(time);
            this.currentState.play(this);              
        }

        this.pausing = function() {
            this.currentState.pause(this);
        }

        this.setPausedTime = function(pauseTime) {
            console.log('set pause time');
            this.pausedTime = pauseTime
        }
        this.getPausedTime = function() {
            return this.pausedTime;
        }


        this.setStartTime = function(startTime) {
            this.startTime = startTime
        }
        
        this.getStartTime = function() {
            return this.startTime;
        }

        this.getPlayState = function() {
            return new PlayState(this);
        }

        this.getStopState = function() {
            return new StopState(this);
        }

        this.getPauseState = function() {
            return new PauseState(this);
        }
        
        this.getClockUtil = function (){
            return clockUtil;
        }
        
        this.setSocket = function (sock){
            this.socket = sock;
        }
        
        this.getSocket = function (){
            return this.socket;
        }         
    };
    
    module.exports = stopwatch;
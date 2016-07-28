var Play = require('../states/playState');
var Stop = require('../states/stopState');
var Pause = require('../states/pauseState');
var clockUtil = require('./util');


function stopwatch() {
        this.currentState = new Stop(this);
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
            
             //when done state change 
            this.changeState(this.getPlayState());   
        }

        this.pausing = function() {
            this.currentState.pause(this);
            this.changeState(this.getPauseState());

        }

        this.setPausedTime = function(pauseTime) {
            this.pausedTime = pauseTime
        }

        this.setStartTime = function(startTime) {
            this.startTime = startTime
        }
        
        this.getStartTime = function() {
            return this.startTime;
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
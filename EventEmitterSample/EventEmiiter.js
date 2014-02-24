var events = require('events');
var util = require('util');

// This is object that generate(emit) events
Radio = function(){
    events.EventEmitter.call(this); // call super class constructor
    this.turnon = function(){
        this.emit('turnon');
    }
    this.changechannel = function(channel){
        this.emit('changechannel',channel);
    }
    this.turnoff = function(){
        this.emit('turnoff');
    }
};
util.inherits(Radio,events.EventEmitter);

// this is listener
RadioListener = function(){
    this.radioTurnOnListener = function(){
        util.debug('Radio turned on!!')
    }
    this.radioChangeChannelListener = function(channel){
        util.debug('Channel has been changed to '+ channel);
    }
    this.radioTurnOffListener = function(){
        util.debug('Radio turned off!!')
    }
}
var radio = new Radio();
var l = new RadioListener(radio);
radio.on('turnon',l.radioTurnOnListener);
radio.on('changechannel', l.radioChangeChannelListener);
radio.on('turnoff', l.radioTurnOffListener);

radio.turnon();
radio.changechannel('kbs');
radio.turnoff();

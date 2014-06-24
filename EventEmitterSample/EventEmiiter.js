var events = require('events');
var util = require('util');

// This is object that generate(emit) events
var Radio = function(){
    events.EventEmitter.call(this); // call super class constructor

};
util.inherits(Radio,events.EventEmitter);

// this is listener
var radioTurnOnListener = function(){
        util.debug('Radio turned on!!')
    }
var radioChangeChannelListener = function(channel){
        util.debug('Channel has been changed to '+ channel);
    }
var radioTurnOffListener = function(){
        util.debug('Radio turned off!!')
    }

var radio = new Radio();

radio.on('turnon',radioTurnOnListener);
radio.on('changechannel', radioChangeChannelListener);
radio.on('turnoff', radioTurnOffListener);

radio.emit('turnon');
radio.emit('changechannel');
radio.emit('turnoff');

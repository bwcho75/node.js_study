module.exports.name = 'B';

module.exports.run = function(name){
	this.name = name;
	console.log(name +'is running');
}

module.exports.stop = function(){
	console.log('stop');
}
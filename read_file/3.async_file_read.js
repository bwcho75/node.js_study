var fs = require('fs');

var contents = fs.readFile('hello.txt','utf-8',function(err,contents){
	console.log('read 1:'+contents);
});

var contents = fs.readFile('hello_second.txt','utf-8',function(err,contents){
	console.log('read 2:'+contents);
});

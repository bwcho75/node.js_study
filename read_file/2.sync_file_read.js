var fs = require('fs');

var contents = fs.readFileSync('hello.txt','utf-8');
console.log(contents);
console.log('read 1');

var contents = fs.readFileSync('hello_second.txt','utf-8');
console.log(contents);
console.log('read 2');
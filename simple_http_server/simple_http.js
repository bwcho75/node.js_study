var http = require('http');
var server = http.createServer();

server.listen(5000,function(){
    console.log('Server started');
});

server.on('connection',function(){
    console.log('Client connected');
});

server.on('close',function(){
    console.log('Client disconnected');
});
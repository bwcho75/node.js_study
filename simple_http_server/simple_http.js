var http = require('http');
var server = http.createServer(function(request,response){
    response.writeHead(200,{'Content-Type':'text/html'});
    response.end(('Hello'));
});

server.listen(5000,function(){
    console.log('Server started');
});

server.on('connection',function(){
    console.log('Client connected');
    server.close();
});

server.on('close',function(){
    console.log('server disconnected');
});
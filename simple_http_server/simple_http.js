var http = require('http');

var server = http.createServer(function(request,response){
    response.writeHead(200,{'Content-Type':'text/html'});
    response.end(('Hello'));
});

server.on('connection',function(){
    console.log('Client connected');
    server.close();
});

server.on('close',function(){
    console.log('server disconnected');
});

if(!module.parent){
    server.listen(5000,function(){
        console.log('Server started');
        console.log('im parent :  module.parent '+module.parent);
    });
}else{
    // this is called when this module is required by other module
    console.log('im child : module.parent '+module.parent);
    module.exports = server;
}
var cluster = require('cluster');
var numberOfCPUs = require('os').cpus().length;

if(cluster.isMaster){
    for(var i=0;i<numberOfCPUs;i++) cluster.fork();

    cluster.on('exit',function(worker,code,signal){
        colsole.log('worker '+worker.process.pid+' exit');
    });

    cluster.on('online',function(worker){
        console.log('worker '+worker.process.pid+' online');
    });
}else{
    var server = require('./simple_http');
    server.listen(3000,function(){
        console.log('server started');
    });
 }

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

var httpServer =http.createServer(app).listen(3000, function(req,res){
    console.log('Socket IO server has been started');
});
// upgrade http server to socket.io server
var io = require('socket.io').listen(httpServer);

var socket_ids = [];
var count = 0;

function registerUser(socket,nickname){
    // socket_id와 nickname 테이블을 셋업
    socket.get('nickname',function(err,pre_nick){
        if(pre_nick != undefined ) delete socket_ids[pre_nick];
        socket_ids[nickname] = socket.id
        socket.set('nickname',nickname,function(){
            io.sockets.emit('userlist',{users:Object.keys(socket_ids)});
        });

    });
}

io.sockets.on('connection',function(socket){
    socket.emit('new',{nickname:'GUEST-'+count});
    registerUser(socket,'GUEST-'+count);
    count++;

    socket.on('changename',function(data){
        registerUser(socket,data.nickname);
    });
    socket.on('disconnect',function(data){
        socket.get('nickname',function(err,nickname){
            if(nickname != undefined){
                delete socket_ids[nickname];
                io.sockets.emit('userlist',{users:Object.keys(socket_ids)});
                //socket.del('nickname',function(){});

            }// if
        });
     });
    socket.on('send_msg',function(data){
        socket.get('nickname',function(err,nickname){

            data.msg = nickname + ' : '+data.msg;
            if(data.to =='ALL') socket.broadcast.emit('broadcast_msg',data); // 자신을 제외하고 다른 클라이언트에게 보냄
            else{
                socket_id = socket_ids[data.to];
                if(socket_id != undefined){
                    io.sockets.socket(socket_id).emit('broadcast_msg',data);
                }// if
            }
            socket.emit('broadcast_msg',data);
        });
    });
});
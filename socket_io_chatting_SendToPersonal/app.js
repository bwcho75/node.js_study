
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

var httpServer =http.createServer(app).listen(8080, function(req,res){
  console.log('Socket IO server has been started');
});
// upgrade http server to socket.io server
var io = require('socket.io').listen(httpServer);

var socket_ids = new Array();
var nicknames = new Array();
var count = 0;

function registerUser(socket,nickname){
    // 중복 제거
    var previous_nickname = nicknames[socket.id];
    console.log('previous nick:'+previous_nickname);
    if(previous_nickname != undefined){
        delete socket_ids[previous_nickname];
    }

    // socket_id와 nickname 테이블을 셋업
    socket_ids[nickname] = socket.id
    nicknames[socket.id] = nickname;

    socket.broadcast.emit('userlist',{users:Object.keys(socket_ids)});
    socket.emit('userlist',{users:Object.keys(socket_ids)});
}

io.sockets.on('connection',function(socket){
   socket.emit('new',{nickname:'GUEST-'+count});
   registerUser(socket,'GUEST-'+count);
    count++;

   socket.on('changename',function(data){
       console.log('change name socket '+socket.id+' '+data.nickname);
       registerUser(socket,data.nickname);
       console.log('nicks :'+Object.keys(socket_ids));
   });
   socket.on('disconnect',function(data){
       nickname = nicknames[socket.id];
       console.log('nickname '+nickname+' has been disconnected');
       // 여기에 방을 나갔다는 메세지를 broad cast 하기
       if(nickname != undefined){
           delete socket_ids[nickname];
           delete  nicknames[socket.id];
       }// if
   });
   socket.on('send_msg',function(data){
       data.msg = nicknames[socket.id] + ' : '+data.msg;
       if(data.to =='ALL') socket.broadcast.emit('broadcast_msg',data); // 자신을 제외하고 다른 클라이언트에게 보냄
       else{
         socket_id = socket_ids[data.to];
         if(socket_id != undefined){
             io.sockets.socket(socket_id).emit('broadcast_msg',data);
         }// if
       }
       socket.emit('broadcast_msg',data); // 해당 클라이언트에게만 보냄. 다른 클라이언트에 보낼려면?
       console.log('Message from client :'+data.msg);
   })
});

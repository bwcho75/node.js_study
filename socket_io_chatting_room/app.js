
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
app.use(express.bodyParser());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

var httpServer =http.createServer(app).listen(8080, function(req,res){
  console.log('Socket IO server has been started');
});
// upgrade http server to socket.io server
var io = require('socket.io').listen(httpServer);

var count = 0;
var rooms = new Array() ;


app.get('/:room',function(req,res){
    console.log('room name is :'+req.params.room);
    res.render('index',{room:req.params.room});
});

function registerUser(socket,room,nickname){
    // 방이 없으면 방을 생성
    if(rooms[room] == undefined ){
        console.log('room create :'+room);
        rooms[room] = new Object();
        rooms[room].nicknames = new Object();
        rooms[room].socket_ids = new Object();
    }
    // 중복 제거
    var previous_nickname = rooms[room].nicknames[socket.id];
    console.log('previous nick:'+previous_nickname);
    if(previous_nickname != undefined){
        delete rooms[room].socket_ids[previous_nickname];
    }

    // socket_id와 nickname 테이블을 셋업
    rooms[room].socket_ids[nickname] = socket.id
    rooms[room].nicknames[socket.id] = nickname;

    socket.broadcast.emit('userlist',{users:Object.keys(rooms[room].socket_ids)});
    socket.emit('userlist',{users:Object.keys(rooms[room].socket_ids)});
}

io.sockets.on('connection',function(socket){

   socket.on('joinroom',function(data){
      socket.join(data.room);
      socket.set('room', data.room,function() {
          socket.emit('new', {nickname: 'GUEST-' + count});
          console.log('join room ' + data.room);
          registerUser(socket, data.room, 'GUEST-' + count);
          count++;
          socket.get('room', function (currentroom) {
              console.log('### SET room :' + currentroom);

          });
      });

   });

    socket.on('disconnect',function(data){
        socket.get('room',function(room) {
            nickname = rooms[room].nicknames[socket.id];
            console.log('nickname ' + nickname + ' has been disconnected');
            // 여기에 방을 나갔다는 메세지를 broad cast 하기
            if (nickname != undefined) {
                delete rooms[room].socket_ids[nickname];
                delete rooms[room].nicknames[socket.id];
            }// if
        }); //get
    });
   socket.on('changename',function(data){
       socket.get('room',function(currentroom){
           console.log('in changename room is '+currentroom);
           console.log('change name socket '+socket.id+' '+data.nickname);
           registerUser(socket,currentroom,data.nickname);
           console.log('nicks :'+Object.keys(socket_ids));
       });
   });

   socket.on('send_msg',function(data){
       socket.get('room',function(room) {
           console.log('in send msg room is '+room);
           data.msg = rooms[room].nicknames[socket.id] + ' : ' + data.msg;
           if (data.to == 'ALL') socket.broadcast.to(room).emit('broadcast_msg', data); // 자신을 제외하고 다른 클라이언트에게 보냄
           else {
               // 귓속말
               socket_id = socket_ids[data.to];
               if (socket_id != undefined) {
                   io.sockets.socket(socket_id).emit('broadcast_msg', data);
               }// if
           }
           socket.emit('broadcast_msg', data); // 해당 클라이언트에게만 보냄. 다른 클라이언트에 보낼려면?
           console.log('Message from client :' + data.msg);
       });
   })
});

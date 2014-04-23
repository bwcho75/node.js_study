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

var httpServer =http.createServer(app).listen(3000, function(req,res){
    console.log('Socket IO server has been started');
});
// upgrade http server to socket.io server
var io = require('socket.io').listen(httpServer);

var count = 0;
var rooms = [];

app.get('/:room',function(req,res){
    console.log('room name is :'+req.params.room);
    res.render('index',{room:req.params.room});
});



io.sockets.on('connection',function(socket){

    socket.on('joinroom',function(data){
        socket.join(data.room);

        socket.set('room', data.room,function() {
            var room = data.room;
            var nickname = '손님-'+count;
            socket.set('nickname',nickname,function(){
                socket.emit('changename', {nickname: nickname});

                // Create Room
                if (rooms[room] == undefined) {
                    console.log('room create :' + room);
                    rooms[room] = new Object();
                    rooms[room].socket_ids = new Object();
                }
                // Store current user's nickname and socket.id to MAP
                rooms[room].socket_ids[nickname] = socket.id

                // broad cast join message
                data = {msg: nickname + ' 님이 입장하셨습니다.'};
                io.sockets.in(room).emit('broadcast_msg', data);

                // broadcast changed user list in the room
                io.sockets.in(room).emit('userlist', {users: Object.keys(rooms[room].socket_ids)});
                count++;
            });
        });

    });

    socket.on('changename',function(data){
        socket.get('room',function(err,room){
            socket.get('nickname',function(err,pre_nick) {
                var nickname = data.nickname;
                // if user changes name get previous nickname from nicknames MAP
                if (pre_nick != undefined) {
                    delete rooms[room].socket_ids[pre_nick];
                }
                rooms[room].socket_ids[nickname] = socket.id
                socket.set('nickname',nickname,function() {
                    data = {msg: pre_nick + ' 님이 ' + nickname + '으로 대화명을 변경하셨습니다.'};
                    io.sockets.in(room).emit('broadcast_msg', data);

                    // send changed user nickname lists to clients
                    io.sockets.in(room).emit('userlist', {users: Object.keys(rooms[room].socket_ids)});
                });
            });

        });
    });


    socket.on('disconnect',function(data){
        socket.get('room',function(err,room) {
            if(err) throw err;
            if(room != undefined
                && rooms[room] != undefined){

                socket.get('nickname',function(err,nickname) {
                    console.log('nickname ' + nickname + ' has been disconnected');
                    // 여기에 방을 나갔다는 메세지를 broad cast 하기
                    if (nickname != undefined) {
                        // 여기 room에 연결된 사람이 없을 경우, 해당 room property를 삭제하는 부분 추가 필요
                        if (rooms[room].socket_ids != undefined
                            && rooms[room].socket_ids[nickname] != undefined)
                            delete rooms[room].socket_ids[nickname];
                    }// if
                    data = {msg: nickname + ' 님이 나가셨습니다.'};

                    io.sockets.in(room).emit('broadcast_msg', data);
                    io.sockets.in(room).emit('userlist', {users: Object.keys(rooms[room].socket_ids)});
                });
            }
        }); //get
    });

    socket.on('send_msg',function(data){
        socket.get('room',function(err,room) {
            socket.get('nickname',function(err,nickname) {
                console.log('in send msg room is ' + room);
                data.msg = nickname + ' : ' + data.msg;
                if (data.to == 'ALL') socket.broadcast.to(room).emit('broadcast_msg', data); // 자신을 제외하고 다른 클라이언트에게 보냄
                else {
                    // 귓속말
                    socket_id = rooms[room].socket_ids[data.to];
                    if (socket_id != undefined) {

                        data.msg = '귓속말 :' + data.msg;
                        io.sockets.socket(socket_id).emit('broadcast_msg', data);
                    }// if
                }
                socket.emit('broadcast_msg', data);
            });
        });
    })
});

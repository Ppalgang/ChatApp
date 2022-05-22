const path = require("path");
const {userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./assets/users');//hata

//socket.io ve express in çalışması.  express localhost kurmak için galiba internetten bakmak lazım socket.io zaten konuşma için
const express = require('express');
const expApp = express();
const http = require('http');
const server = http.createServer(expApp);
const { Server } = require("socket.io");
const io = new Server(server);
expApp.use(express.static('public'))



//chat uygulamasının çalıştığı kısım devamı chat.html dosyasının içindeki script kısmında beraber çalışıyorlar
expApp.get('/', (req, res) => {
    res.sendFile(path.join(`${__dirname}/main.html`));
  });

  io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
    
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);
    
        console.log('a user connected room');
        socket.broadcast.to(user.room).emit('chat message', user.username + ' odaya katıldı.');

        io.to(user.room).emit('roomUsers', {
            room : user.room,
            users: getRoomUsers(user.room)
        });
    });

    socket.on('chat message', (msg) => {
        const user = getCurrentUser(socket.id);
        //console.log(socket.id + ': ' + msg);
        socket.to(user.room).emit('chat message', '<strong style="color: blue;">' + user.username + (msg));
      });

    socket.on('typing', () => {
        const user = getCurrentUser(socket.id);
        socket.broadcast.to(user.room).emit('typing', user.username)
      });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){
            console.log('user disconnected');
            socket.to(user.room).emit('chat message', (user.username + ' Bağlantıyı Kesti.'));
            io.to(user.room).emit('roomUsers', {
                room : user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
  });

  //express localhost ile diğer dosyalara erişme
  expApp.use('/',(req,res,next) => {
    res.sendFile(path.join(__dirname,'chat.html'));
  });
 
  //serverin dinlenmesi ve port ayarlama
  server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
  });



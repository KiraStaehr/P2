'use strict';
/*express and node stuff */
const express = require('express');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const PORT = 5000;



//let app2 = require('http').createServer(function(req, res){
//  fileServer.serve(req, res);
//}).listen(PORT);
/*for doing io stuff*/
const io = require('socket.io')(http);
let io2=io.listen(http);

/*our modules*/
const user = require("./scripts/user");

/*path that clients can use, this means it cant access core server files*/
app.use('/clientjs', express.static(path.join(__dirname, '/node_modules/socket.io/client-dist')));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/js')));
app.use(express.static(path.join(__dirname, '/public/css')));
app.use(express.static(path.join(__dirname, '/public/resources')));



/*sends index.html to client browser*/
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});



/*io.on is the server listening*/
io.on('connection', (socket) => {

  //sets the socket id to the user id
  socket.id = user.createUser(user.newID());

  //index where this user is in users array
  const i = user.findIndexID(user.users, socket.id);

  //shows all active ids and free ids
  user.showAll();
  console.log(`user ${socket.id} connected`);
  user.showNewProp(i);

  //sends the correct user object to client
  socket.emit('connection', user.users[i]);

  socket.on('disconnect', () => {
    //when user disconnects do this
    console.log(`user ${socket.id} disconnected`);

    //deletes user when client disconnets
    user.deleteID(socket.id);
    user.showAll();
  });
//***********TEST**************///
  // convenience function to log server messages on the client
  function log() {
    let array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('message', function(message) {
    log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', function(room) {
    log('Received request to create or join room ' + room);

    let clientsInRoom = io.sockets.adapter.rooms[room];
    let numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
    log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 0) {
      socket.join(room);
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);

    } else if (numClients === 1) {
      log('Client ID ' + socket.id + ' joined room ' + room);
      io2.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io2.sockets.in(room).emit('ready');
    } else { // max two clients
      socket.emit('full', room);
    }
  });

  socket.on('ipaddr', function() {
    let ifaces = os.networkInterfaces();
    for (let dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

  socket.on('bye', function(){
    console.log('received bye');
  });
//***********TEST**************///
});



/*listens to PORT set on top*/
http.listen(process.env.PORT || PORT, () => {
  console.log(`Welcome to Akvario @ *:${PORT}`);
});

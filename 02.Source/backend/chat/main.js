/**
 * Created by DELL-INSPIRON on 10/5/2016.
 */
'use strict';
// https://github.com/socketio/socket.io/tree/master/examples/chat

// #io.emit | #socket.broadcast.emit
// differentiate io.sockets.emit and broadcast
// http://stackoverflow.com/questions/10342681/whats-the-difference-between-io-sockets-emit-and-broadcast

  // forward to all user
  // io.emit('public-chat', msg);

  // send to this one
  // socket.emit(...)

  // send to all except this one
  // socket.broadcast.emit(...)

var redisClient = require('../utils/redis-instance');
var ChatSession = require('../utils/chat-session');
var chatSession = new ChatSession(redisClient);

module.exports = function(io) {
  io.on('connection', function(socket) {

    console.log('a user connected');
    chatSession.onlineUsers().then(users => {
      socket.emit('so-on', users);
    });
    
    /**
     *
     */
    socket.on('disconnect', function() {
      chatSession.revoke(socket.id).then(uid => {
        if(uid) {
          io.emit('so-off', uid);
          console.log('user disconnected');
        } // else: duplicated uid & force to disconnect to server
      });
    });

    /**
     *
     */
    socket.on('online', function (payload) {
      chatSession.store(payload, socket.id).then(result => {
        if(result) {
          let data = [payload];
          socket.broadcast.emit('so-on', data);
        } else {
          // duplicated uid & force to disconnect to server
          socket.disconnect();
        }
      });

      
    });

    /**
     *
     */
    socket.on('new-message', function(msg) {
      chatSession.findSocketId(msg.receiver).then(receiverSocketId => {
        if(!receiverSocketId)
          return;
        socket.emit('new-message', msg);
        io.to(receiverSocketId).emit('new-message', msg);
      });
    });

    socket.on('ping', function(payload) {
        console.log(payload);
    });
  });
};
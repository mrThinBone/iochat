/**
 * Created by DELL-INSPIRON on 10/6/2016.
 */
app.controller('ChatController', ['$scope', '$http', '$cookies',
  function ($scope, $http, $cookies) {
    var uID = $cookies.get('m_id');
    if(!uID) {
      window.location = '/index.html';
      return;
    }
    $scope.u_name = uID;

    var onlineMapper = {};
    var conversations = {};
    var previous = -1;
    var conversationId = "";
    $scope.online = [];
    $scope.messages = [];

//http://stackoverflow.com/questions/4432271/node-js-and-socket-io-how-to-reconnect-as-soon-as-disconnect-happens
    var socket = io();
    socket.on('connect', function () {
      console.log('connected ' + (new Date().toUTCString()));
      socket.emit('online', uID);
    });

    socket.on('so-on', function (payload) {
      // payload: [ 'id', ... ]
      for(var k in payload) {
        // k is id
        let _id = payload[k];
        
        let friend = {
          id: _id,
          css_selected: ''
        };
        // console.log(friend);
        onlineMapper[_id] = $scope.online.length;
        conversations[_id] = [];
        $scope.$apply(function () {
          $scope.online.push(friend);
        });
      }
    });

    socket.on('so-off', function (payload) {
      // payload: id
      var index = onlineMapper[payload];
      $scope.$apply(function () {
        $scope.online.splice(index, 1);
      });
      if(index === previous)
        previous = -1;
      delete onlineMapper[payload];
    });

    socket.on('new-message', function (payload) {
      console.log(payload);
      var isMe = payload.sender === uID;
      let conversationKey = isMe ? payload.receiver : payload.sender;
      if(!isMe)
        payload.css = 'others';
      else
        payload.css = 'self';
      conversations[conversationKey].push(payload);

      if(conversationId === conversationKey) {
        $scope.$apply(function () {
          $scope.messages.push(payload);
        });
      }
    });

    socket.on('disconnect', function () {
      console.log('disconnected' + (new Date().toUTCString()));
      $cookies.remove('m_id');
      socket.close();
      window.location = '/index.html';
    });

    $scope.onConversationSelected = function (id) {
      let index = onlineMapper[id];
      if(previous === index) {
        return;
      }
      conversationId = id;

      if(previous !== -1) {
        $scope.online[previous].css_selected = '';
      }

      $scope.online[index].css_selected = 'selected';
      previous = index;

      $scope.messages.length = 0;
      var history = conversations[id];
      for (var m in history) {
        $scope.messages.push(history[m]);
      }
    };

    $scope.sendMessage = function () {
      var data = {
        sender: uID,
        receiver: conversationId,
        content: $scope.msg_content
      };
      //
      socket.emit('new-message', data);
    };

    // ping server per 10 minutes to keep connection alive
    setInterval(function() {
      socket.emit('ping', 'still alive');
    }, 600000);
  }
]);
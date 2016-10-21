/**
 * Created by DELL-INSPIRON on 10/10/2016.
 */
app.controller('MainController', ['$scope', '$http', '$cookies',
  function ($scope, $http, $cookies) {
    var token = $cookies.get('m_token');
    if(token) {
      window.location = '/chat.html';
    }

    $scope.signIn = function () {
      $http({
        method: 'POST',
        url: '/users/login',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: $scope['authUsr'],
          pwd: $scope['authPwd']
        }
      }).then(
        function (resp) {
          var data = resp.data;
          if(data.token) {
            $cookies.put('m_token', data.token);
            $cookies.put('m_id', $scope['authUsr']);
            window.location = '/chat.html';
          } else {
            alert('Failed to authenticate.')
          }
        },
        function(err) {
        });
    };
  }
]);
/**
 * Created by DELL-INSPIRON on 10/6/2016.
 */
app.controller('MainController', ['$scope', '$http', '$cookies',
  function ($scope, $http, $cookies) {

    $scope.signIn = function () {
      console.log('aaaa');
      $http({
        method: 'GET',
        url: '/users/uid'
      }).then(
        function (resp) {
          var data = resp.data;
          if(data.id) {
            $cookies.put('m_id', data.id);
            window.location = '/chat.html';
          } else {
            alert('Failed to authenticate.')
          }
        },
        function(err) {
          console.log(err);
        });
    };
  }
]);
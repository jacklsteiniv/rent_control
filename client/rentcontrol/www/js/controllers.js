angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, $location, Auth) {
  var vm = this;

  //get user info if logged in
  vm.loggedIn = Auth.isLoggedIn();

  //on each HTTP req, check if logged in
  $scope.$on('$routeChangeStart', function(){
    vm.loggedIn = Auth.isLoggedIn();


  //get user info
  Auth.getUser()
    .success(function(data) {
      vm.user = data;
    });
  });

  //handle login
  vm.doLogin = function() {

    Auth.login(vm.loginData.email, vm.loginData.password)
      .success(function(data) {

        //take logged-in user to search page.
        $window.location.href = '#/search'
      });
  };
})

//this controller handles user creation/auth.

// .controller('UserCtrl', function($scope, User) {
//   var vm = this;
// })


.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})



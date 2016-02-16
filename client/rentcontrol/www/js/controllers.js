angular.module('starter.controllers', [])

.controller('MainCtrl', function($location, Auth){

})

.controller('CreateUserCtrl', function(User) {
  var vm = this;

  vm.saveUser = function() {

    User.create(vm.userData)
      .success(function(data) {
        vm.userData = {};
        console.log("You signed up!")
        $window.location.href = '#/search'

    });
  }
})

.controller('SearchCtrl', function() {
  var vm = this;

})

.controller('LoginCtrl', function($location, $rootScope, $state, Auth) {
  console.log("Login controller loaded");
  var vm = this;

  //get user info if logged in
  vm.loggedIn = Auth.isLoggedIn();

  // // //on each HTTP req, check if logged in
  $rootScope.$on('$routeChangeStart', function() {
    vm.loggedIn = Auth.isLoggedIn();


  //get user info
  Auth.getUser()
    .success(function(data) {
      vm.user = data;
    });
  });

  //handle login
  vm.doLogin = function() {
    console.log("doLogin function")
    vm.error = '';

    Auth.login(vm.loginData.email, vm.loginData.password)
      .success(function(data) {
        console.log("Successfully logged you in");
        $state.go('search');
        console.log(data);

        //take logged-in user to search page.
        if(data.successs)
          $state.go('tab.dash'); //go to the search state
        else
          vm.error = data.message;
      });
  };

  vm.printStuff = function() {
    console.log('hello');
  }
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



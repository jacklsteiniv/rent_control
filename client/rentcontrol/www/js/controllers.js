angular.module('starter.controllers', [])


.controller('MainCtrl', function($location, Auth){

})

.controller('CreateUserCtrl', function($http, $state) {
  var vm = this;

  //make an $http POST request to users.

  vm.saveUser = function() {
    $http.post('http://localhost:8080/api/users', vm.userData)
    .success(function(data) {
        vm.userData = {};
        console.log("You signed up!")
        $state.go('questions');
    //User.create(vm.userData)
    });
  }
})

.controller('QuestionsCtrl', function() {
  var vm = this;
  //You want to $push results of the individual's questions into their .priorities.
  //Your logic for tabulating various priorities will go here.
  //start with price.
  console.log('In the questions controller');



  //http put request to user - update choices?


  // User.choices['budget'] = choice; //the budget
  // User.update();

  //think about where to define this function.
  // User.pushChoice
  // .success

})

.controller('SearchCtrl', function($q, $http) {
  var vm = this;
  API_KEY='X1-ZWz19uqcii2ozv_1zmzq';
  //when you hit search, it makes an API call to Zillow.
  //the results are filtered by the user's priorities, and
  //pushed to their 'results' array.

  //(1.) Get city+state from input box.
  vm.getText = function() {
    console.log("getText function")
    var citystate = vm.location;
    console.log(citystate); //should be Portland, OR
  }

  //(2.) chop up city state (.split(',') into city and state.)

  //(3.) request promise for API call to zillow db.
  //good
  //   var promise = $q(function(resolve, reject) {
  //     $http('http://www.zillow.com/webservice/GetRegionChildren.htm?zws-id='+ API_KEY+'&state=or&city=portland&childtype=neighborhood').then(function() {
  //   console.log("You made the call, now get req.body.")

  //   });
  // });
})

.controller('ResultsCtrl', function() {
  var vm = this;
  //this will show the top 3 results that fit the criteria
  //for that user.
  //NOTE: start with price.
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
        $state.go('questions');
        console.log(data);

        // //take logged-in user to search page.
        // if(data.successs)
        //   $state.go('tab.dash'); //go to the search state
        // else
        //   vm.error = data.message;
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



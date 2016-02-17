angular.module('starter.controllers', [])


.controller('MainCtrl', function($location, Auth){

})

.controller('CreateUserCtrl', function($http, $state) {
  var vm = this;

  //make an $http POST request to users api route.

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

.controller('QuestionsCtrl', function($http) {
  var vm = this;
  //You want to $push results of the individual's questions into their .priorities.
  //Your logic for tabulating various priorities will go here.
  //start with price.

 //for ...4 iterations, through the question html pages
  // vm.pushChoice = function() {
  //   console.log("In the push choice function");
  //   $http.put('http://localhost:8080/users/', vm.choice)
  //   .success(function(data) {
  //     vm.choice = '';
  //     console.log("You pushed the choice to user");
  //     $state.go('questions');
  //   })
  // }
  //You're going to want to make an $http PUT
  //request to users/:user_id.


  // User.choices['budget'] = choice; //the budget
  // User.update();

})

.controller('SearchCtrl', function($q, $http, $scope, ZillowEndpoint) {
  var vm = this;
  API_KEY='X1-ZWz19uqcii2ozv_1zmzq';
  console.log("the Zillow API url is " + ZillowEndpoint.url);
  //when you hit search, it makes an API call to Zillow.
  //the results are filtered by the user's priorities, and
  //pushed to their 'results' array.

  //(1.) Get city+state from input box.
  vm.getHood = function() {
    var citystate = vm.location;

  //(2.) chop up city state (.split(',') into city and state.)
    var locationArr = citystate.split(',');
    var city = locationArr[0];
    var state = locationArr[1];
    //(3.) We make POST request to our node route
    //to pass it the city and state. Try just passing 1 param = citystate
    $http.post('http://localhost:8080/api/external', {city: city, state: state})
    .success(function(req, res) {
      vm.nameArr = res.nameArr;
      console.log("The array is here in Angular, here: " + vm.nameArr); //displaying the nameArr in angular view.
      //apiRouter.makeCall();
    })
    .error(function() {
      console.log("Error, your data didn't make it to Node");
    })
    //(4.)The Node route/server will then have a route & function
    //taking care of the Zillow API call. It will get the results,
    //and res.send it back to this controller.
    //(5.)the results can then be viewed on the front end.


    };




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



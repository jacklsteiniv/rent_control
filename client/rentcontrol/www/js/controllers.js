angular.module('starter.controllers', ['starter.services']) //services


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

  vm.pushChoice = function() {
    var filters = []; //this is where your filters for your search go.
    filters.push(vm.choice); //get the value
  }

})

.controller('SearchCtrl', function($http, $scope, Cities, ZillowEndpoint) {
  var vm = this;
  API_KEY='X1-ZWz19uqcii2ozv_1zmzq';
  console.log("the Zillow API url is " + ZillowEndpoint.url);
  //when you hit search, it makes an API call to Zillow.
  //the results are filtered by the user's priorities, and
  //pushed to their 'results' array.

  //(1.) Get city+state from input box.
  vm.getHood = function() {
    //$scope.Cities = Cities.all();

    var citystate = vm.location;

  //(2.) chop up city state (.split(',') into city and state.)
    var locationArr = citystate.split(',');
    var city = locationArr[0];
    var state = locationArr[1];
    //(3.) We make POST request to our node route
    //to pass it the city and state. Try just passing 1 param = citystate
    $http.post('http://localhost:8080/api/external', {city: city, state: state})
    //(4.)The Node route/server will then have a route & function
    //taking care of the Zillow API call. It will get the results,
    //and res.send it back to this controller.

    //(5.)the results can then be viewed on the front end
    //as the response! See below.

    .success(function(response) {

      //response = JSON.stringify(response);
      //Go through the response object you get; push each property into a new arr.
      var hoodArr = [];
      response['nameArr'].forEach(function(hood) {
        hoodArr.push(hood);
      })
      console.log("The hoodArr is " + hoodArr);

      var numArr = [];
      response['zindexArr'].forEach(function(price) {
        numArr.push(price);
      })
      console.log("The numArr is " + numArr);
      //name the response as a variable to render in angular.
      vm.hoodArr = hoodArr;

      //Run through numArr (for var i in...), if the price
      //is below the threshold (i.e. 500000), push it to new array,
      //and append the hood at that same index to it. You can split them later.

      var priceArr = [];
      var filter = 500000 //the max price.
      for (var i in numArr) {
        if(numArr[i] <= filter) {
          numArr[i] += hoodArr[i]; //join the values of hoodArr and numArr at same index together.
          priceArr.push(numArr[i]);
          // priceArr.push(hoodArr[i]); //push in the arr at that same index.
          // priceArr.join(', '); //join them together - i.e. 355000CapitolHill.
        }
      }
      priceArr.sort();
      console.log("The priceArr meeting filter 500000 is " + priceArr);

      //Shuffle for random results.
      function shuffle(priceArr) {
        var i = 0;
        var j = 0;
        var temp = null;
        for (var i in priceArr) {
          j = Math.floor(Math.random() * (i+1)); //get a random index
          temp = priceArr[i]; //temporarily set the index.
          priceArr[i] = priceArr[j]; //set i equal to j, the random index.
          priceArr[j] = temp; //now you get that temporary index.
        }
        return priceArr;
      }

      shuffle(priceArr);
      console.log("The shuffled priceArr meeting filter 500000 is " + priceArr);


      //Appending 1, 2 and 3 neighborhoods to list items.
      //Split each item into its number (substring 0,6; 6, priceArr[i].length)
      document.getElementById('numone').innerHTML = priceArr[1].substring(0,6);
      document.getElementById('one').innerHTML = priceArr[1].substring(6, priceArr[1].length+10);
      document.getElementById('numtwo').innerHTML = priceArr[2].substring(0,6);
      document.getElementById('two').innerHTML = priceArr[2].substring(6, priceArr[1].length+10);
      document.getElementById('numthree').innerHTML = priceArr[3].substring(0,6);
      document.getElementById('three').innerHTML = priceArr[3].substring(6, priceArr[1].length+10);

      vm.city = locationArr[0];
      vm.state = locationArr[1];

      //SAVING TO FACTORY (for Results use -> dynamic display.)
      //Here we push that citystate into the cityFactory. ResultsCtrl will use this.
      vm.cities = Cities.all();
      console.log("Here is an empty $scope.cities: " + vm.cities);
      vm.cities.add(vm.city);
      vm.cities.add(vm.state)
      console.log("And here is $scope.cities with citystate inside: " + vm.cities);


      document.getElementById('city').innerHTML = locationArr[0];

    })
    .error(function() {
      console.log("Error, your Zillow data didn't make it back from Node.");
    })
    //That takes care of the post to Node.
    }

})

.controller('ResultsCtrl', function($http) {
  var vm = this;

  //Below, set vm. city and vm.state, based on the cityFactory contents.

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

        // // //take logged-in user to search page.
        if(data.success)
          console.log(data);
          $state.go('questions'); //go to the search state
        // else
        //   vm.error = data.message;
        //   $state.go('signin');
      // .error(function() {
      //   vm.error = data.message;
      //   $state.go('signin');
      });
  //};

  vm.printStuff = function() {
    console.log('hello');
  }

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



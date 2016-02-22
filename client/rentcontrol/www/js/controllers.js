angular.module('starter.controllers', ['starter.services']) //services

//defining host on client side
// var host = "http://ec2-54-191-27-68.us-west-2.compute.amazonaws.com" || "http://localhost"

.controller('MainCtrl', function($location, Auth){

})

.controller('CreateUserCtrl', function($http, $state, Host) {
  var vm = this;
  var host = "http://localhost" || "http://ec2-54-191-27-68.us-west-2.compute.amazonaws.com";
  var port = 8080;
  //make an $http POST request to users api route.

  vm.saveUser = function() {
    $http.post(host + ':'+ port+'/api/users', vm.userData)
    .success(function(data) {
        vm.userData = {};
        console.log("You signed up!")
        $state.go('questions');
    });
  }
})

.controller('QuestionsCtrl', function($http, Filters) {
  var vm = this;

  vm.pushChoice = function() {
    var maxbudget = vm.maxbudget;
    vm.filters = Filters.all();
    vm.filters.add(maxbudget); //now the filter is available to the SearchCtrl.
    console.log("Your max budget as stated is " + vm.filters[0]);
  };
})

.controller('SearchCtrl', function($http, $scope, Cities, Prices, Filters, Host) {
  var vm = this;
  API_KEY='X1-ZWz19uqcii2ozv_1zmzq';
  var host = "http://localhost" || "http://ec2-54-191-27-68.us-west-2.compute.amazonaws.com";
  var port = 8080;
  //when you hit search, it makes an API call to Zillow.
  //the results are filtered by the user's priorities, and
  //pushed to their 'results' array.

  //(1.) Get city+state from input box.

  var searchCount = -3;

  vm.getHood = function() {
    //$scope.Cities = Cities.all();
    searchCount+=3;
    var citystate = vm.location;

    //Get the filter.
    vm.filters = Filters.all();

  //(2.) chop up city state (.split(',') into city and state.)
    var locationArr = citystate.split(',');
    var city = locationArr[0];
    var state = locationArr[1];
    //(3.) We make POST request to our node route
    //to pass it the city and state. Try just passing 1 param = citystate
    $http.post(host + ':'+ port + '/api/external', {city: city, state: state})
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
      numArr.splice(0,1);
      console.log("The numArr is " + numArr);
      //name the response as a variable to render in angular.
      vm.hoodArr = hoodArr;

      //Run through numArr (for var i in...), if the price
      //is below the threshold (i.e. 500000), push it to new array,
      //and append the hood at that same index to it. You can split them later.

      //NOTE: consider re-writing as an array of Objects (key = hood, value = zindex)
      //for more accurate hood-zindex matching

      var priceArr = [];
      var filter = vm.filters[0];
      console.log("The filter is " + filter); //the max price. You get this from the Filters controller.
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
      //Splice out the first element (just a number, invalid)
      priceArr.splice(0,1);

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
      console.log("The shuffled priceArr meeting filter" + filter + " is " + priceArr);

      //PROMISE
      //Set up a promise below: You want this to finish before ResultsCtrl starts.
      //var dataPromise = function() {

      //You're going to want to send the priceArr to the service.
      vm.prices = Prices.all();
      console.log("Here's an empty vm.prices: " + vm.prices);
      vm.prices.add(priceArr[0]); //push the first three components of priceArr into the price factory.
      vm.prices.add(priceArr[1]);
      vm.prices.add(priceArr[2]);
      console.log("And here is the priceArr factory with three contents: " + vm.prices);

      vm.city = locationArr[0]; //the city
      vm.state = locationArr[1]; //the state

      //SAVING TO FACTORY (for Results use -> dynamic display.)
      //Here we push that citystate into the cityFactory. ResultsCtrl will use this.
      vm.cities = Cities.all();
      console.log("Here is an empty $scope.cities: " + vm.cities);
      vm.cities.add(vm.city);
      vm.cities.add(vm.state)
      console.log("And here is $scope.cities with citystate inside: " + vm.cities);

      //And for the Prices factory
       vm.prices = Prices.all();
        console.log("The prices array in Results is " + vm.prices);
        vm.price1 = vm.prices[0+searchCount];
        vm.price2 = vm.prices[1+searchCount];
        vm.price3 = vm.prices[2+searchCount];

        // Appending 1, 2 and 3 neighborhoods to list items.
        // Split each item into its number (substring 0,6; 6, priceArr[i].length)
        document.getElementById('numone').innerHTML = vm.price1.substring(0,6);
        document.getElementById('one').innerHTML = vm.price1.substring(6, vm.price1.length);
        document.getElementById('numtwo').innerHTML = vm.price2.substring(0,6);
        document.getElementById('two').innerHTML = vm.price2.substring(6, vm.price2.length);
        document.getElementById('numthree').innerHTML = vm.price3.substring(0,6);
        document.getElementById('three').innerHTML = vm.price3.substring(6, vm.price3.length);
        document.getElementById('locale').innerHTML = "<h3>Here are some great neighborhoods under your stated budget.</h3>";


        //Google maps url. Need to inject $sce to trust it as a URL.
        //$scope.currentProjectUrl = $sce.trustAsResourceUrl($scope.currentProject.url)

        // document.getElementById('map').innerHTML = "https://www.google.com/maps/embed/v1/place?q=LosAngeles,CA&key=AIzaSyC448ZcgKl06FhNnLfo612YzbE6PCltOcw"
    })
    .error(function() {
      console.log("Error, your Zillow data didn't make it back from Node.");
    })
    //That takes care of the post to Node.
    }

})

.controller('ResultsCtrl', function($http, Cities, Prices) {
  var vm = this;

  //Note: everything executes asynchronously. This will fire off as the Search Ctrl
  //is being executed. Therefore, run everything single-page from Search Ctrl.

    // //Set variables for contents of the cityFactory.
    // vm.cities = Cities.all();
    // console.log("The cities array in Results is "+ vm.cities);
    // vm.city = vm.cities[0];
    // vm.state = vm.cities[1];
    // vm.citystate = JSON.stringify(Cities.all());

    // //And for the Prices factory
    // vm.prices = Prices.all();
    // console.log("The prices array in Results is " + vm.prices);
    // vm.price1 = vm.prices[0];
    // vm.price2 = vm.prices[1];
    // vm.price3 = vm.prices[2];

})

.controller('LoginCtrl', function($location, $rootScope, $state, Auth, Host) {
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


        // console.log("Successfully logged you in");
        // $state.go('questions');
        // console.log(data);

        // // //take logged-in user to search page.
        if(data.success) {

          console.log(data);
          $state.go('questions');
        } //go to the search state
        else {
          vm.error = data.message;
          $state.go('signin');
        }
       });
      // .error(function() {
      //   vm.error = data.message;
      //   $state.go('signin');

  //};
  };

})

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



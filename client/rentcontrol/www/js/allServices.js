angular.module('starter.services', [])

  //All services will go here.

//Set the host here.

.factory('Host', function() {
  var host = "http://localhost" || "http://ec2-54-191-27-68.us-west-2.compute.amazonaws.com";

  return host;
})
//log user in, log out, check if logged in.
.factory('Auth', function($http, $q, AuthToken, Host) {

  var authFactory = {};
  var host = "http://localhost" || "http://ec2-54-191-27-68.us-west-2.compute.amazonaws.com";
  var port = 8080;

  //login function
  authFactory.login = function(email, password) {

    //promise object for login
    return $http.post(host + ':' + port + '/api/authenticate', { //calling on API endpoint for token.
      email: email,
      password: password,
      //zip: zip
    }).success(function(data) {
      AuthToken.setToken(data.token);
      return data; //token
    });
  };
  //log user out = clear token
  authFactory.logout = function() {
    AuthToken.setToken();
  };

  //see if a user is logged in
  authFactory.isLoggedIn = function() {
    if(AuthToken.getToken())
      return true; //logged in
    else
      return false;
  };

  //get logged in user
  authFactory.getUser = function() {
    if(AuthToken.getToken())
      return $http.get('/api/me', {cache: true});
    else
      return $q.reject({message: "The user has no access token."});
  };



  return authFactory;
})

.factory('AuthToken', function ($window) {

  var authTokenFactory = {};
  authTokenFactory.getToken = function() { //grab token from local storage.

  return $window.localStorage.getItem('token');
  };

  //if token passed, set it; if no token, clear
  authTokenFactory.setToken = function(token) {
    if(token)
      $window.localStorage.setItem('token', token);
    else
      $window.localStorage.removeItem('token');
  };

  return authTokenFactory;
})


.factory('AuthInterceptor', function($q, $location, AuthToken) {

  var interceptorFactory = {};

  //on each HTTP request, grab token
  interceptorFactory.request = function(config) {

    var token = AuthToken.getToken();

    if(token)
      config.headers['x-access-token'] = token;

    return config;
  };

  interceptorFactory.responseError = function(response) {

    if(response.status == 403) { //error - forbidden
      AuthToken.setToken();
      $location.path('/login');
    }
    return $q.reject(response);
  };

  return interceptorFactory;
})

//Begin userServices

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

})

//Users factory for login/storing user data.
//this connects with API routes in Node, and with MongoDB.

.factory('User', function($http) {

  var userFactory = {};

  //GET 1 user
  userFactory.get = function(id) {
    return $http.get('/api/users/' + id);
  }

  //GET all users
  userFactory.get = function() {
    return $http.get('/api/users');
  }

  //POST a new user with schema data
  userFactory.create = function(userData) {
    return $http.post('/api/users/', userData);
  }

  //UPDATE a user - and their choices@
  userFactory.update = function(id, userData) {
    return $http.put('/api/users' + id, userData);
  }

  //DELETE a user
  userFactory.delete = function(id) {
    return $http.delete('/api/users' + id);
  }

  //return the whole userFactory
  return userFactory;

})

//Begin Cities services
.factory('Cities', function() { //this is where you store city & state to pass from SearchCtrl --> ResultsCtrl.

  var cityFactory = [];

  cityFactory.add = function(city) {
    cityFactory.push(city); //here they are
  }

  cityFactory.all = function() {
      return cityFactory;
      cityFactory = [];
  }

  return cityFactory; //make city and state available.
})

.factory('Prices', function() { //this is where you store the shuffled priceArr to pass from SearchCtrl --> ResultsCtrl.

  var priceFactory = [];

  priceFactory.add = function(priceArr) {
    priceFactory.push(priceArr); //here they are
  }

  priceFactory.all = function() {
      return priceFactory;
  }

  return priceFactory; //make priceArr available.
})

.factory('Filters', function() { //this is where you store the shuffled priceArr to pass from SearchCtrl --> ResultsCtrl.

  var filterFactory = [];

  filterFactory.add = function(filter) {
    filterFactory.push(filter); //here they are
  }

  filterFactory.all = function() {
      return filterFactory;
  }

  return filterFactory; //make priceArr available.
})


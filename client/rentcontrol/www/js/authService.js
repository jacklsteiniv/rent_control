angular.module('starter.services', [])

//log user in, log out, check if logged in.
.factory('Auth', function($http, $q, AuthToken) {

  var authFactory = {};

  //login function
  authFactory.login = function(username, password) {

    //promise object for login
    return $http.post('/api/authenticate', {
      name: name,
      email: email,
      password: password,
      zip: zip
    }).success(function(data) {
      AuthToken.setToken(data.token);
      return data;
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


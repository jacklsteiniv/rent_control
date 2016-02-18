angular.module('starter.services', [])

.factory('City', function() { //this is where you store city & state to pass from SearchCtrl --> ResultsCtrl.

  var cityFactory = {};
  var list = [];

  cityFactory.add = function(city) {
    cityFactory.list.push({city:city}); //here they are
  }

  return cityFactory; //make city and state available.
})


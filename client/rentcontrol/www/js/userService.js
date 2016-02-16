angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ed Yu',
    lastText: 'I am an Ed Mon'
  }, {
    id: 1,
    name: 'Morgan Lim',
    lastText: 'Look at our great app!'
  }, {
    id: 2,
    name: 'Keyan B',
    lastText: 'I should buy a cat'
    // face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'La Baik',
    lastText: 'Can someone take the trash out?'
  }, {
    id: 4,
    name: 'Grant Roy',
    lastText: 'It depends...'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };

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

});

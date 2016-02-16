angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

//set up API endpoint as a constant
.constant('ApiEndpoint', {
  url: 'http://localhost:8080/api'
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

// application configuration to integrate token into requests
.config(function($httpProvider) {

  // attach our auth interceptor to the http requests
  $httpProvider.interceptors.push('AuthInterceptor');

})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  //dash = the home page for login/resistration.
   .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        //controller: 'SearchCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  //END nested tabs.

  //Login
  $stateProvider
  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/login.html'
  })

  //Signup
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
  })

// Questions views

  .state('questions', {
    url: '/questions',
    templateUrl: 'templates/questions.html',
  })
   //question states - nested (4 different ones)
   .state('question1', {
    url: '/question1',
    templateUrl: 'templates/question1.html',
   })
   .state('question2', {
    url: '/question2',
    templateUrl: 'templates/question2.html',
   })
   .state('question3', {
    url: '/question3',
    templateUrl: 'templates/question3.html',
   })
   .state('question4', {
    url: '/question4',
    templateUrl: 'templates/question4.html',
   })

//Searching
  .state('search', {
    url: '/search',
    templateUrl: 'templates/search.html',
  })

  //Displaying results
  .state('/results', {
    url: '/results',
    templateUrl: 'templates/results.html',
  })


  //results page below (hard-seed w/ data, ng-repeat.)
  //this will contain data from the Zillow API call

  $urlRouterProvider.otherwise('/tab/dash');

});

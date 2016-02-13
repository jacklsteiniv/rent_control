// Back-end (server side.)

//packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var Promise  = require('request-promise');
var port = 8080;
//pull in the User schema from Mongo
var User = require('./app/models/user');

//connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rentcontrol')

//app config
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//CORS config for access

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
  Authorization');
  next();
});

//log to console

app.use(morgan("combined"));

//set up your routes for API.
//eventually move these into config folder, routes file.

app.get('/', function(req, res) {
  res.json({message: "Welcome"})
});

var apiRouter = express.Router();

apiRouter.use(function(req, res, next) {
  console.log("Visiting");

  next();
});

apiRouter.get('/', function(req, res) {
  res.json({message: "Welcome to the User API for Rent control!"})
})

app.use('/api', apiRouter);

//API routes

apiRouter.route('/users')

  //Create a user
  .post(function(req, res) {

    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save(function(err) {
      if (err) res.send(err);
      else {
        res.json({message: "User was created!"});
      }
    })
  })

  //Get all users
  .get(function(req, res) {

    User.find(function(err, users) {
      if (err) res.send(err)
        else {
          res.json(users);
        }
    })
  })

apiRouter.route('/users/:user_id')

  //Get one user
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if(err) res.send(err)
      else {
        res.json(user);
      }
    })
  })

  //Update a user
  .put(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if(err) res.send(err)

      //only update user information if it's new
    if(req.body.name) user.name = req.body.name;
    if(req.body.email) user.email = req.body.email;
    if(req.body.password) user.password = req.body.password;

    //save it
    user.save(function(err) {
      if(err) res.send(err);

      res.json({message: "Updated user!"});
    })
    })
  })

  //Delete a user
  .delete(function(req, res) {
    User.remove({
      _id: req.params.user_id
    }, function(err, user) {
      if(err) res.send(err);

      res.json({message: "User was successfully deleted"})

    })
  })



//listen on port 8080

app.listen(port);
console.log("Listening on port " + port);

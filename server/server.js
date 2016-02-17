// Back-end (server side.)
//adding dotenv up at the top
var dotenv = require('dotenv');
dotenv.load();
//packages
var express = require('express');
var cors = require('cors'); //cors middleware

var app = express();
app.use(cors());

//Request module for back-end API calls in Node
var request = require('request');

var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var rp  = require('request-promise');
var port = 8080;
//pull in the User schema from Mongo
var User = require('./app/models/user');

//token auth
var jwt = require('jsonwebtoken');
var superSecret = 'blamechance';

//connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rentcontrol')

//app config
app.use(express.static(__dirname + "/www"));
app.listen(process.env.PORT || port);
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

//authentication route - must go before the CRUD routes

apiRouter.post('/authenticate', function(req, res) {

  //find user, select email and password
  User.findOne({
    email: req.body.email
  }).select('email password').exec(function(err, user) {

    if(err) throw err;

    if(!user) {
      res.json({
        success: false,
        message: 'Auth has failed - user not found'
      })
    } else if(user) {
      //if user exists, check for a password match
        console.log('here')
      var validPassword = user.comparePassword(req.body.password);
      if(!validPassword) {
        res.json({
          success: false,
          message: 'Auth failed - wrong password'
        });
      } else {
        //if correct user and password
        var token = jwt.sign({
          name: user.name,
          email: user.email
        }, superSecret, {
          expiresIn: 86400 //24 hour lifespan for token
        });

        //return token as JSON
        res.json({
          success: true,
          message: 'Here is your access token',
          token: token
        });
      }
    }

  })
});

//route middleware for verifying token
apiRouter.use(function(req, res, next) {

  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if(token) {

    jwt.verify(token, superSecret, function (err, decoded) {
      if(err) {
        return res.status(403).send({
          success: false,
          message: 'Failed authentication'
        });
      } else { //if the token is correct, all good
        req.decoded = decoded;

        next();
      }
    });
  } else { //if no token
      return res.status(403).send({
        success: false,
        message: 'No token was provided'
      });
    }

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

//Get user information
apiRouter.get('/me', function(req, res) {
  res.send(req.decoded);
})

//Make an aPI call to Zillow. Handle a post(so, get)
apiRouter.all('/external', function(req, res) {
  //insert the city and state you got from Angular front-end
  //into the API call to Zillow.
      API_KEY='X1-ZWz19uqcii2ozv_1zmzq';
      console.log("Here's req.body.city: "+ req.body.city);
      console.log("Here's the req.body.state: " + req.body.state);
      // res.json({message: "In Node, going to make API call to Zillow."}) //this is data.
      //use request promise module (rp) to access Zillow API
      rp('http://www.zillow.com/webservice/GetRegionChildren.htm?zws-id='+ API_KEY+'&state='+req.body.state+'&city='+req.body.city+'&childtype=neighborhood').then(function(data) {
        //console.log("Here's all the Zillow stuff: " + data);

        //(4.) Manipulate the xML data:
        //split at <childtype>
        var nameArr = []; //you're going to push names here.
        var zindexArr = []; //you're going to push zindex values here.
        data = data.split('<count>')[1]; //all data pertaining to neighborhoods.
        //this is the second half of XML after <count>.
        var stopIndex = data.indexOf('</count>'); //get the number in front of ths;
        var count = data.substring(0,stopIndex); //this is the number of items.

        //Split data up by <name> 0- just get all the names.
        var newArr = data.split('<name>');
        for(var i = 0; i < newArr.length; i++) {
          var index1 = newArr[i].indexOf('<');
          var name = newArr[i].substring(0, index1);
          nameArr.push(name);
        }
        console.log("Here's the nameArr: " + nameArr); //gets the results

        //Do the same for the zindexArr.
        var numArr = data.split('<zindex currency="USD">');
        for(var j = 0; j< numArr.length; j++) {
          var index1 = numArr[j].indexOf('<');
          var num = numArr[j].substring(0, index1);
          zindexArr.push(num);
        }
        console.log("And here is the zindexArr: " + zindexArr);

         //send nameArr to angular.
          res.json({nameArr: nameArr, zindexArr:zindexArr});//see what you get back.
      }, function(reason) {
        console.log('failing because of ' + reason);
      });


})


//listen on port 8080
console.log("Listening on port " + port);

// Back-end (server side.)

//packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var Promise  = require('request-promise');
var port = process.env.PORT || 8000;
console.log("Listening on port" + port);

//app config
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//CORS config for access

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
Authorization');
next();
});

//log to console

app.use(morgan);

//set up your routes for API.
//eventually move these into config folder, routes file.

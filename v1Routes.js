var util = require('util');
var debug = util.debuglog('login');

var app = require('express').Router();
var bodyParser = require('body-parser');

var auther = require('./auther');
var login = require('./login');
var USERNAME_HEADER = 'io-senders-username';
var REGEN_HEADER = 'io-senders-token-regen';

app.use(bodyParser.json());

app.post('/login',function(req,res){
  try{
    debug('Login Attempt');
    var username = req.body.username;
    var password = req.body.password;
    debug('Username: [ %s ]',username);
    var loggedIn = login.authenticate(username,password);
    if(loggedIn){
      debug('Logged in');
      res.set(USERNAME_HEADER,username);
      res.json(auther.generate(username));
      res.status(200);
    }else{
      res.status(401);
      res.json('Invalid username or password');
    }
  }catch(err){
    console.error('Error: [ %j ]',err);
    res.json('An error occurred during login');
    res.status(500);
  }
});

app.post('/verify',function(req,res){
  try{
    debug('Verify attempt');
    var username = req.get(USERNAME_HEADER);
    debug('User name: [ %s ] ',username);
    var token = req.body.token;
    debug('Token: [ %s ]', token);
    var regen = req.get(REGEN_HEADER);
    debug('Regen? [ %s ]', regen);
    var newToken = auther.verify(username,token,regen);
    if(newToken){
      debug('Verified');
      res.status(200);
      res.set(USERNAME_HEADER,username);
      res.json(newToken);
    }else{
      debug('Verification failed');
      res.status(401);
      res.json('Verification failed');
    }
  }catch(err){
    console.error('Error: [ %j ]',err);
    res.json('An error occurred during verification');
    res.status(500);
  }
});

module.exports = app;

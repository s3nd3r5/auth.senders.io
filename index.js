'use strict';
var util = require('util');
var debug = util.debuglog('login');
var express = require('express');
var app = express();
var v1Routes = require('./v1Routes');
var PORT = process.env.AUTH_PORT || 3000;

function ping(req,res){
  debug('ping');
  res.json('pong');
  res.status(200);
};

app.get('/',ping);
app.get('/ping',ping);

app.use('/api/v1',v1Routes);

app.listen(PORT,function(){
  util.log('Auth listening on: ' + PORT);
});

module.exports = app;

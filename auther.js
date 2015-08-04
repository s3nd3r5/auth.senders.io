'use strict';
var jwt = require('jsonwebtoken');
var SECRET = process.env.SHH;
var EXP_TIME = parseInt(process.env.AUTH_EXP_TIME,10) || 900;
var debug = require('util').debuglog('auth');
function _generateToken(username){
  if(typeof username !== 'string' || username.trim().length === 0){
    throw new Error('Invalid username passed to generate function: [ '
                    + username + '] ');
  }
  return jwt.sign({ username:username },SECRET,{ algorithm:'HS256', issuer:'io.senders.auth', expiresInSeconds:EXP_TIME});
}

function _verifyToken(username, token,regen){
  try{
    var decoded = jwt.verify(token,SECRET);
    debug('Valid token');
    if(decoded.username !== username){
      debug(
        'Invalid username for auth token: '
        + 'Token UN: [ %s ] Requested UN: [ %s ]'
        ,decoded.username, username
      );
      return false;
    }
    debug('Verified');
    if(regen){
      debug('Regen: [ %s ]',regen);
      return _generateToken(decoded.username);
    }else return token;
  }catch(err){
    debug('An error has occurred: %j',err);
    return false;
  }
}

module.exports = {
  generate: _generateToken
  ,verify: _verifyToken
};

// NOTE THIS IS A MOCK CLASS FOR TESTING PURPOSES
'use strict';
var util = require('util');
var debug = util.debuglog('login');
module.exports = {
  authenticate:function(username,password){
    debug('Login Attempt [%s]',username);
    var authed = username === 'senders' && password === 'testpassword123';
    debug('Login successful [%s]',authed);
    return authed;
  }
}

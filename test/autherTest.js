'use strict';
var rewire = require('rewire');
var auther = rewire('../auther');
var assert = require('should');
var sinon = require('sinon');
var TS_SECS = 5;
var clock;
describe('Auther', function(){
  //Auther Test should set expires timeout to greater than 1 for sanity
  (TS_SECS).should.be.greaterThan(1);

  before(function(){
    clock = sinon.useFakeTimers();
    auther.__set__({
      SECRET:'Kittens'
      ,EXP_TIME:TS_SECS
    });
  });

  after(function(){ clock.restore(); });

  describe('generate',function(){
    it('should return a token when passed a username',function(){
      var token = auther.generate('test');
      (token).should.be.a.String();
      token.length.should.be.greaterThan(0);
    });
    it('should throw an exception if username is missing', function(){
      (function(){
        auther.generate();
      }).should.throw();
    });
    it('should throw an exception if username is not a string', function(){
      (function(){
        auther.generate({});
      }).should.throw();

      (function(){
        auther.generate([100]);
      }).should.throw();
      (function(){
        auther.generate(5);
      }).should.throw();
      (function(){
        auther.generate(true)
      }).should.throw();
      (function(){
        auther.generate(function(){});
      }).should.throw();
    });
  });

  describe('verify',function(){
    it('should verify a token for the proper username',function(){
      var user = 'test';
      var token = auther.generate(user);
      var newToken = auther.verify(user,token);
      (token).should.be.a.String();
      token.length.should.be.greaterThan(0);
    });

    it('should return falsy if token does not match username',function(){
      var user = 'test';
      var token = auther.generate(user);
      (auther.verify(user + "AAAAA",token)).should.not.be.ok();
    });

    it('should invalidate the token after a set time',function(){
      var user = 'test';
      var token = auther.generate(user);
      (auther.verify(user,token)).should.be.ok();
      clock.tick(TS_SECS * 1000 + 1);
      (auther.verify(user,token)).should.not.be.ok();
    });

    it('should return the same token if regen not set',function(){
      var user = 'test';
      var token = auther.generate(user);
      clock.tick(TS_SECS * 500);
      var newToken = auther.verify(user,token);
      (newToken).should.be.exactly(token);
    });

    it('should return the same token if regen not set and under exp time',function(){
      var user = 'test';
      var token = auther.generate(user);
      clock.tick(1000);
      var newToken = auther.verify(user,token);
      (newToken).should.be.exactly(token);
    });

    it('should return a new token if regen set to true (after at least 1s has passed)',function(){
       var user = 'test';
      var token = auther.generate(user);
      clock.tick(1000);
      var newToken = auther.verify(user,token,true);
      (newToken).should.not.match(token);
    });
  });

});

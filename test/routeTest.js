process.env.SHH = 'Bunnies';
process.env.AUTH_EXP_TIME=5;
var request = require('supertest');
var should = require('should');
var app = require('../index');
var auther = require('../auther');
var sinon = require('sinon');

describe('Auth',function(){
  var USERNAME_HEADER = 'io-senders-username';
  var REGEN_HEADER = 'io-senders-token-regen';
  var clock;
  before(function(){
    clock = sinon.useFakeTimers();
  });
  after(function(){
    clock.restore();
  });
  describe('GET /',function(){
    it('should respond with json and 200',function(done){
      request(app)
      .get('/')
      .expect('Content-Type',/json/)
      .expect(JSON.stringify('pong'))
      .expect(200,done);
    });
  });

  describe('GET /ping',function(){
    it('should respond with json and 200',function(done){
      request(app)
      .get('/')
      .expect('Content-Type',/json/)
      .expect(JSON.stringify('pong'))
      .expect(200,done);
    });
  });

  describe('POST /api/v1/login',function(){
    it('should respond with a token, username in header, and 200 for valid login',function(done){
      var username = 'senders';
      var password = 'testpassword123';
      var token = JSON.stringify(auther.generate(username));
      request(app)
      .post('/api/v1/login')
      .set('Accept','application/json')
      .send({ username: username, password: password })
      .expect('Content-Type',/json/)
      .expect(USERNAME_HEADER,username)
      .expect(token)
      .expect(200,done);
    });

    it('should respond with json and 401 for invalid login',function(done){
      var username = 'invalid';
      var password = 'loginattempt';
      request(app)
      .post('/api/v1/login')
      .set('Accept','application/json')
      .send({ username: username, password: password })
      .expect('Content-Type',/json/)
      .expect(401,done);
    });
  });

  describe('POST /api/v1/verify',function(done){
    it('should respond with 200 and the token on successful verification',function(done){
      var username = 'testguy';
      var token = auther.generate(username);
      request(app)
      .post('/api/v1/verify')
      .set('Accept','application/json')
      .set(USERNAME_HEADER, username)
      .send({ token: token })
      .expect(JSON.stringify(token))
      .expect(USERNAME_HEADER,username)
      .expect('Content-Type',/json/)
      .expect(200,done);
    });
  });


  describe('POST /api/v1/verify',function(done){
    it('should respond with 200 and a new token on successful verification after 1s if regen set to true',function(done){
      var username = 'testguy';
      var token = auther.generate(username);
      clock.tick(1000);
      var newToken = auther.generate(username);
      request(app)
      .post('/api/v1/verify')
      .set('Accept','application/json')
      .set(USERNAME_HEADER, username)
      .set(REGEN_HEADER,true)
      .send({ token: token })
      .expect(JSON.stringify(newToken))
      .expect(USERNAME_HEADER,username)
      .expect('Content-Type',/json/)
      .expect(200,done);
    });

    it('should respond with 401 and a json error on expired token',function(){
      var username = 'testguy';
      var token = auther.generate(username);
      clock.tick(process.env.AUTH_EXP_TIME * 1001);
      request(app)
      .post('/api/v1/verify')
      .set('Accept','application/json')
      .set(USERNAME_HEADER, username)
      .set(REGEN_HEADER,true)
      .send({ token: token })
      .expect('Content-Type',/json/)
      .expect(401,done);
    });
  });
});

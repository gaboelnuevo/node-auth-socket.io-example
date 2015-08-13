var should = require('should');
var io = require('socket.io-client'),
    server = require('../server');

var app = require('./../app');
var assert = require('assert');
var request = require('supertest');
var models = require('./../models');

var socketURL = 'http://0.0.0.0:3000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var socketio_token = 'fixedtoken';

describe('OAuth sign in', function() {
  var accessToken;
  var refreshToken;
  var clientSecretBase64 = new Buffer('123').toString('base64');
  var clientCredentials = 'papers3' + clientSecretBase64;

  it('should allow tokens to be requested', function(done) {
    request(app)
      .post('/oauth/token')
      .type('form')
      .auth(clientCredentials, '')
      .send({
        grant_type: 'password',
        username: 'test@example.com',
        password: 'test',
        client_id: 'test_client',
        client_secret: '123'
      })
      .expect(200)
      .end(function(err, res) {
        assert(res.body.access_token, 'Ensure the access_token was set');
        assert(res.body.refresh_token, 'Ensure the refresh_token was set');
        accessToken = res.body.access_token;
        refreshToken = res.body.refresh_token;

        done();
      });
  });

  it('should permit access to routes that require a access token', function(done) {
    request(app)
      .get('/socket/token')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .end(function(err, res) {
        socketio_token = res.body.token;
        done();
      });
  });

  it('should allow the refresh token to be used to get a new access token', function(done) {
    request(app)
      .post('/oauth/token')
      .type('form')
      .auth(clientCredentials, '')
      .send({
        grant_type: 'refresh_token',
        username: 'test@example.com',
        password: 'test',
        client_id: 'test_client',
        client_secret: '123',
        refresh_token: refreshToken
      })
      .expect(200)
      .end(function(err, res) {
        assert(res.body.access_token, 'Ensure the access_token was set');
        assert(res.body.refresh_token, 'Ensure the refresh_token was set');
        accessToken = res.body.access_token;
        refreshToken = res.body.refresh_token;
        done();
      });
  });
  
});
  
describe("socket.io Server",function(){
  it('Should connect',function(done){
    var client = io.connect(socketURL, options);
    client.on('connect',function(data){
      done(); 
    });
  });

  it('Should authenticate',function(done){
    var client = io.connect(socketURL, options);
    client.on('connect',function(data){
      client.emit('authentication', {token: socketio_token});
      client.on('authenticated', function() {
        client.disconnect();
        done(); 
      });
    });
  });
});


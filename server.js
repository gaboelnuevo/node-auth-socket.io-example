/*var app = require('./app');
var http = require('http');

var socket = require('./socket');

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port:', app.get('port'));
  console.log('listening on http://localhost:'+ app.get('port'));
});

socket.io.listen(server);*/

var app = require('./app');

var socket = require('./socket');

var server = require('http').createServer(app);

var jwt = require('jsonwebtoken');

app.get('/', function (request, response){
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end('this works');
});


server.listen(app.get('port'), function(){
  console.log('Express server listening on port:', app.get('port'));
  console.log('listening on http://localhost:'+ app.get('port'));
});

var io = socket.io.listen(server)

function authenticate(data, cb) {
  if (!data.token) {
    cb(new Error('Missing credentials'));
  }
  jwt.verify(data.token, 'secret', function(err, decoded) {      
    if (err) {
      cb(null, false);  
    }else {
      //req.decoded = decoded;
      cb(null, true);
    }
  });
}

require('socketio-auth')(io, {
  timeout:80,
  authenticate: authenticate
});

module.exports = server;

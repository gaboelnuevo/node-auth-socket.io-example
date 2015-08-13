var express = require('express'),
    bodyParser = require('body-parser'),
    oauthserver = require('oauth2-server'),
    errorHandler = require('errorhandler');

var jwt = require('jsonwebtoken');

var models = require('./models');
var socket = require('./socket');
var app = express();

app.set('env', process.env.NODE_ENV || 'development');
app.set('port', process.env.PORT || 3000);
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//app.use(express.cookieParser('ncie0fnft6wjfmgtjz8i'));
//app.use(express.cookieSession());
//app.locals.title = 'OAuth Example';
//app.locals.pretty = true;


app.oauth = oauthserver({
  model: models.oauth,
  grants: ['password', 'authorization_code', 'refresh_token'],
  debug: true
});


app.all('/oauth/token', app.oauth.grant());

app.get('/', function (req, res) {
  res.send('working');
});

app.get('/socket/token', app.oauth.authorise(), function (req, res) {
  var token = jwt.sign(req.user, 'secret', { expiresInMinutes: 60*5 });
  res.json({token: token});
});

app.get('/secret', app.oauth.authorise(), function (req, res) {
  res.send('hello');
});

app.all('/hello', function(req, res){
  if(req.query.name){
      res.send('hello '+ req.query.name);
  }else{
      res.send('hello world');
  }
});


app.use(app.oauth.errorHandler());

if ('development' === app.get('env')) {
  app.use(errorHandler());
}

module.exports = app;

var server = require('./server');
var models = require('./models');

function seed(){
  models.User.create({
    email: 'test@example.com',
    hashed_password: '$2a$10$aZB36UooZpL.fAgbQVN/j.pfZVVvkHxEnj7vfkVSqwBOBZbB/IAAK' //password: test
  }, function(err, user) {
      if(err)
          console.log(err);
      else
          console.log("User created!");
  });

  models.OAuthClientsModel.create({
      clientId: 'test_client',
      clientSecret: '123',
      redirectUri: '/oauth/redirect'
  }, function(err, client) {
      if(err)
          console.log(err);
      else
          console.log("Client created!!");
  });
}

seed(function(){
  process.exit();
});

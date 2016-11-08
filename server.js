var express = require('express');
var app = express();
var bodyParser= require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./models/user');
var port = process.env.port || 8080;

mongoose.connect(config.database);

app.set('secret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/',function(req,res){
  res.send('this api is from localhost' + port + '/api')
});

app.listen(port);
console.log("how does this log? http://localhost:" + port);


app.get('/setup',function(req,res){

  var jenny = new User({
    name: 'Jenny Tomato',
    password: 'password',
    admin: true
  });

  jenny.save(function(err){
    if(err) throw err;
    console.log('User saved successfully');
    res.json({success:true});
  })

})

var apiRoutes = express.Router();

//todo: route to authenticate a user

apiRoutes.post('/authenticate', function(req,res){
  User.findOne({
    name: req.body.name
  }),function(err, user){
    if (err) throw err;

    if (!user){
      res.json({success: false, message:'Authentication failed.User Not found.'});
    } else if (user){

      //check for password matching
      if(user.password != req.body.password){
        res.json({success: false, message:'Authentication failed. Wrong password.'});
      } else {

        var token = jwt.sign(user, app.get('secret'),{
          expiresinMinutes: 1440
        });

      }




    }


  }
});

//todo route middleware to verify a token

apiRoutes.get('/users', function(req, res){
  User.find({}, function(err,users){
    res.json(users);
  });
});

app.use('/api', apiRoutes);

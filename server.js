var express = require('express');
var app = express();
var bodyParser= require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./app/models/user');
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

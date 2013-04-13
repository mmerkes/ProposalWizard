var   express = require('express'),
      http = require('http'),
      mongodb = require('mongodb');

var app = express();

var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
var db = new mongodb.Db('proposals', server);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.bodyParser());
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/login.html');
});

app.post("/", function(req, res){
  var users = {'_id': req.body.username, 'email': req.body.email};
  db.open(function(err, db) {
    if(!err) {
      db.collection('users', function(err, collection){
        collection.insert(users, {safe : true}, function(err, result){
          if (err) {
            console.log(err);
            res.sendfile(__dirname + '/error.html');
          } else {
            console.log(result);
            collection.find().toArray(function(err, docs){
                console.log(docs);
                db.close();
            });
            res.send("Got it!");
          }
        });
      });
    }
  });
});

app.get("/hi", function(req, res){
  var message = [
    "<h1> Hello, Express </h1>",
    "<p> Welcome to 'Building Web Apps in Node.js with Express.'</p>",
    "<p> You'll love Express because it's</p>",
    "<ul><li>fast</li>",
    "<li>fun</li>",
    "<li>flexible</li></ul>"].join("\n");

  res.send(message);
});
/*
app.get("/users/:userId", function(req, res){
  res.send("<h1>Hello, User #" + req.params.userId + "!</h1>");
}); */

app.post("/users", function(req, res){
  res.send("Creating a new user with the name " + req.body.username + ".");
});

app.get(/\/users\/(\d*)\/?(edit)?/, function(req, res){
  var message = "user #" + req.params[0] + "'s profile";

  if (req.params[1] === 'edit') {
    message = "Editing " + message;
  } else {
    message = "Viewing " + message;
  }

  res.send(message);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

/*
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
}); */

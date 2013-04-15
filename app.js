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
  res.sendfile(__dirname + '/new_entry.html');
});

app.post("/", function(req, res){
  var proposal = {'pi_name': req.body.pi_name, 'project_title': req.body.project_title,
                  'short_title': req.body.short_title, 'start_date': req.body.start_date,
                  'end_date': req.body.end_date, 'deadline': req.body.deadline,
                  'sponsor': req.body.sponsor, 'app_type': req.body.app_type
                  };
  db.open(function(err, db) {
    if(!err) {
      db.collection('proposal', function(err, collection){
        collection.insert(proposal, {safe : true}, function(err, result){
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

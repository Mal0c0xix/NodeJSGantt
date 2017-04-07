var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(port);
var util = require('util');
var LocalStrategy = require('passport-local').Strategy;

var port = process.env.PORT || '3000';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/node-auth')
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

var index = require('./routes/index');
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// passport configuration
var User = require('./models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.listen(port, () => {
  console.log("Serveur en écoute sur 127.0.0.1:", port);
})


// chat 

app.get('/chat', ensureAuthenticated, function(req, res){
  res.render('chat', { user: req.user, title: 'Chat' });
});

app.get('/user/:uid', ensureAuthenticated, function(req, res){
  var user_id = req.params.uid;
  mongoose.findUserById(user_id, function (err, user) {
    console.log("[DEBUG][/user/uid] %s -> {%j, %j}", user_id, err, user);
    if(err) {
      res.send(500);
      return
    }
    if(user === null) {
      res.send(404);
    }
    else {
      res.render('user', { seeUser: user, title: user.username, user: req.user });
    }
  });
});


var usersonline = {};

io.sockets.on('connection', function (socket) {
  var connected_user = {};

  // send updates with online users
  var i = setInterval(function() {
    socket.emit('whoshere', { 'users': usersonline });
  }, 3000);

  console.info("[DEBUG][io.sockets][connection]");


  socket.on('iamhere', function (data) {
    // This is sent by users when they connect, so we can map them to a user.
    console.log("[DEBUG][io.sockets][iamhere] %s", data);

    mongoose.findUserById(data, function (err, user) {
      console.log("[DEBUG][iamhere] %s -> {%j, %j}", data, err, user);
      if (user !== null) {
        connected_user = user;
        usersonline[connected_user.id] = {
          id: connected_user.id,
          name: connected_user.username
        };
      }
    });
  });


  socket.on('message', function (data) {
    if (connected_user.username === undefined) {
      console.warn('[WARN][io.sockets][message] Got message before iamhere {%s}', util.inspect(data));
      socket.emit('new message', {message: '<em>You must log in before chatting. That\'s the rule</em>'});
      return
    }
    var msg = {
      message: data.message,
      from: connected_user.username,
      timestamp: new Date().getTime()
    }

    console.log("[DEBUG][io.sockets][message] New message '%j' from user %s(@%s)", msg, connected_user.username, connected_user.id);

    mongoose.saveMessage(msg, function (err, saved) {
      if (err || !saved) {
        socket.emit('new message', {message: util.format("<em>There was an error saving your message (%s)</em>", msg.message), from: msg.from, timestamp: msg.timestamp});
        return;
      }
      socket.emit('new message', msg);

      // Send message to everyone.
      socket.broadcast.emit('new message', msg);
    });
  });

  mongoose.findMessages(10, function (err, messages) {
    if (!err && messages.length > 0) {
      socket.emit('history', messages);
    }
  });


  socket.on('disconnect', function() {
    if (connected_user.id !== undefined) {
      delete usersonline[connected_user.id];
      console.log("[DEBUG][io.sockets][disconnect] user: %s(@%s) disconnected", connected_user.username, connected_user.id);
    }
    else {
      console.log("[WARN][io.sockets][disconnect] Received disconnect message from another univers");
    }
  });
});


// fin chat

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


module.exports = app;

'use strict'
// Gestion des middlewear
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);

// Base de données et connexion
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const logger = require('morgan');

// Temps réel sur le gantt
const async = require('async');
const socketio = require('socket.io');

// Affichage
const favicon = require('serve-favicon/');

// Définition du port
const port = process.env.PORT || '3000';

// Gestion de la connexion BD
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/node-auth')
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

// Import de la gestion des routes
const index = require('./routes/index');
const users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// A décommenter quand le favicon sera dans /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Configuration de express
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

// Définitions des routes express
app.use('/', index);
app.use('/users', users);

// Passport configuration
const User = require('./models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Gestion io et temps réel avec les gantts
var server = require('http').createServer(app);
var io = socketio.listen(server);
var sockets = [];
// Quand il y a une connection à un gantt
io.on('connection', function (socket) {
    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
    });
    
    // Mise à jour du gantt -> broadcast
    socket.on('ganttUpdate', function (msg) {
        broadcast('ganttUpdate', msg);
      });
});

// Fonction pour envoyer la mise à jour à tous les utilisateurs
function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

// Gère tous les cas de page non connues
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Permet d'obtenir les érreurs et de débugger
app.use(function(err, req, res, next) {
  // Permet d'envoyer des logs en local afin de débugger
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Envoi de la page d'érreur
  res.status(err.status || 500);
  res.render('error');
});

// Le serveur écoute sur le port 3000
http.listen(port, () => {
  console.log("Serveur en écoute sur 127.0.0.1:", port);
})

module.exports = app;

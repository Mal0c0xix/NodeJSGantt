var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");
var Project = require("../models/Project");

var userController = {};

/******************** HOME  ********************/
// Restreint l'accès à la root page
userController.home = function(req, res) {
  res.render('index', { user : req.user });
};

/******************** PROJECTS  ********************/
// Accède à la page projects après connexion
userController.projects = function(req, res) {
  User.find(null, (err, users) =>{
    if (err) { console.log(err); }
    console.log(users);
    res.render('projects', { user : req.user, userslist : users });  
  });
};

// Accède à la page projects après connexion
userController.createProject = function(req, res) {
  Project.register(new Project({ username : req.body.username, name: req.body.name }), req.body.password, function(err, user) {
    if (err) {
      return res.render('register', { user : user });
    }

  });
};

/******************** AUTHENTIFICATION  ********************/
// Accès page enregistrer
userController.register = function(req, res) {
  res.render('register');
};

// Création de compte
userController.doRegister = function(req, res) {
  User.register(new User({ username : req.body.username, name: req.body.name }), req.body.password, function(err, user) {
    if (err) {
      return res.render('register', { user : user });
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
};

// Accès page login
userController.login = function(req, res) {
  res.render('login');
};

// Connexion
userController.doLogin = function(req, res) {
  passport.authenticate('local')(req, res, function () {
    res.redirect('/projects');
  });
};

// Déconnexion
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

// Export du module
module.exports = userController;
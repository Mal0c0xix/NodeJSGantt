'use strict';

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
  Project.find(null, (err, projects) =>{
    if (err) { console.log(err); }
    console.log(projects);
    res.render('projects', { user : req.user, projectslist : projects });  
  });
};

// Accède à la page projects après connexion
userController.createProject = function(req, res) {
  console.log("Entrée create Project " + req.body);
  
  let project = new Project({ titre : req.body.titre, chatID: req.body.chat, description : req.body.description, gantt : req.body.ganttID});
  
  project.save(function(err) {
    if (err) {
      console.log(err);
    }
  });
};

// Accède à la page du détail d'un project
userController.getProjectDetails = function(req, res) {
  Project.findOne({ name : req.name }, (err, projects) =>{
    if (err) { console.log(err); }
    console.log(projects);
    res.render('projectDetails', { user : req.user, project : projects });  
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
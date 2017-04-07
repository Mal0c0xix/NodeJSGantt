'use strict';

const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../models/User");
const Project = require("../models/Project");

const userController = {};

/******************** HOME  ********************/
// Restreint l'accès à la root page
userController.home = (req, res) => {
  res.render('index', { user : req.user });
};

/******************** PROJECTS  ********************/
// Accède à la page projects après connexion
userController.projects = (req, res) => {
  Project.find(null, (err, projects) =>{
    if (err) { console.log(err); }
    console.log(projects);
    res.render('projects', { user : req.user, projectslist : projects });  
  });
};

// Accède à la page projects après connexion
userController.createProject = (req, res) => {
  console.log("Entrée create Project " + req.body);
  
  let project = new Project({ titre : req.body.titre, chatID: req.body.chat, description : req.body.description, gantt : req.body.ganttID});
  
  project.save((err) => {
    if (err) {
      console.log(err);
    }
  });
};

// Accède à la page du détail d'un project
userController.getProjectDetails = (req, res) => {
  console.log("Entrée fonction getprojectDetails");
  Project.findOne({ name : req.body.titre }, (err, projects) =>{
    if (err) { console.log(err); }
    console.log(projects);
    res.render('projectDetails', { user : req.user, project : projects });  
  });
};

/******************** AUTHENTIFICATION  ********************/
// Accès page enregistrer
userController.register = (req, res) => {
  res.render('register');
};

// Création de compte
userController.doRegister = (req, res) => {
  User.register(new User({ username : req.body.username, name: req.body.name }), req.body.password, (err, user) => {
    if (err) {
      return res.render('register', { user : user });
    }

    passport.authenticate('local')(req, res, () => {
      res.redirect('/projects');
    });
  });
};

// Accès page login
userController.login = (req, res) => {
  res.render('login');
};

// Connexion
userController.doLogin = (req, res) => {
  passport.authenticate('local')(req, res, () => {
    res.redirect('/projects');
  });
};

// Déconnexion
userController.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

// Export du module
module.exports = userController;
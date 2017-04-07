'use strict';
const express = require('express');
const router = express.Router();
const auth = require("../controllers/AuthController.js");

// Fonction permettant de vérifier que l'utilisateur est connecté
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

// bloque le fichier index pour les non authentifiés
router.get('/', auth.home);

// route vers register page
router.get('/register', auth.register);

// route pour register action
router.post('/register', auth.doRegister);

// route vers login page
router.get('/login', auth.login);

// route pour login action
router.post('/login', auth.doLogin);

// route pour logout action
router.get('/logout', auth.logout);

// route pour projects après login
router.get('/projects', loggedIn, auth.projects);

router.post("/projects/create", loggedIn, auth.createProject);

router.post("/projects/details", loggedIn, auth.getProjectDetails);

module.exports = router;

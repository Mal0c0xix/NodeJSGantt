'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const ProjetSchema = new Schema({
    numeroProjet : Number,
    gantt : String
});

ProjetSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Gantt', ProjetSchema);
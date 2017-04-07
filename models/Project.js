var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var ProjetSchema = new Schema({
    titre : String,
    chatID : Number,
    participants : Array(100),
    ressources : Array(100),
    description : String,
    gantt : Number
});

ProjetSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Projet', ProjetSchema);
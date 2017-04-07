var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjetSchema = new Schema({
    titre : String,
    chatID : Number,
    participants : Array(100),
    ressources : Array(100),
    description : String,
    gantt : Number
});

module.exports = mongoose.model('Projet', ProjetSchema);
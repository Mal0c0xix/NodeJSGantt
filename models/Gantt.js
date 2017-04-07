var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var ProjetSchema = new Schema({
    numeroProjet : Number,
    gantt : String
});

ProjetSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Gantt', ProjetSchema);
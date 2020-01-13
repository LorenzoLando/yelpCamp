//require mongoose
const mongoose = require("mongoose");
//require passport-local-mongoose to use it as a plugin on the usershcema
const passportLocalMongoose = require("passport-local-mongoose");


const UserSchema = new mongoose.Schema({
	username: String,
	password: String
});

//inserendo passportLocalMongoose come plugin ci permette di avere tutte le funzionalita di passport nel modello
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
//importo mongoose per farlo funzionare nel modulo
const mongoose = require("mongoose"); //mongoose to add js to databases


//schema setup 
const campgroundSchema = new mongoose.Schema({
	name:String,
	image:String,
	description: String
});


//inizializzo l`oggetto definendolo sulla base del modello
//esporto il modello nel file app.js
module.exports = mongoose.model("Campgroud", campgroundSchema);
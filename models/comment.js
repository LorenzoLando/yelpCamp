//importo mongoose per farlo funzionare nel modulo
const mongoose = require("mongoose"); //mongoose to add js to databases


//schema setup 
const commentSchema = new mongoose.Schema({
	text:String,
	author:String,
	
});


//inizializzo l`oggetto definendolo sulla base del modello
//esporto il modello nel file app.js
module.exports = mongoose.model("Comment", commentSchema);
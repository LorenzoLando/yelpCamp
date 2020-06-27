//importo mongoose per farlo funzionare nel modulo
const mongoose = require("mongoose"); //mongoose to add js to databases


//schema setup 
//1 data association by reference to associate a comment with its user, the 
const commentSchema = new mongoose.Schema({
	text:String,
	author:{
		id: {
			type: mongoose.Schema.Types.ObjectId,//1
			ref: "User"
		},
		username: String
	}
	
});


//inizializzo l`oggetto definendolo sulla base del modello
//esporto il modello nel file app.js
module.exports = mongoose.model("Comment", commentSchema);
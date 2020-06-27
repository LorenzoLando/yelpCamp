//importo mongoose per farlo funzionare nel modulo
const mongoose = require("mongoose"); //mongoose to add js to databases

//schema setup
//1 syntax for data association by reference to associate a campground with its related comments
//e`lòggetto di configurazione per una proprieta`individuale
const campgroundSchema = new mongoose.Schema({
	name:String,
	image:String,
	description: String,
	author:{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId, //1
         ref: "Comment"
      }
   ]
});


//inizializzo l`oggetto definendolo sulla base del modello
//esporto il modello nel file app.js
module.exports = mongoose.model("Campgroud", campgroundSchema);
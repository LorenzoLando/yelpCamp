//importo mongoose per farlo funzionare nel modulo
const mongoose = require("mongoose"); //mongoose to add js to databases


//schema setup
//1 riferimento all`id del commento con l`id del commento che voglio attribuire al record.
const campgroundSchema = new mongoose.Schema({
	name:String,
	image:String,
	description: String,
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
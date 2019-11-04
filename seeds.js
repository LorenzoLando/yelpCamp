//lo scopo di questo file e` camncellare tutti i dati da database
const mongoose = require("mongoose"), //mongoose to add js to databases
	  Campground = require("./models/campground"); //sto importando mongoose.model("Campgroud", campgroundSchema);


const seedDB = () => {
	Campground.remove({}, (err) => {
	if(err){
		console.log(err);
	}
	console.log("removed campgrounds!");
	});
}

//esportero` questo file in app.js
module.exports = seedDB;








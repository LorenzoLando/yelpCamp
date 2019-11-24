//lo scopo di un file seeds e seminare il database con alcuni dati
//lo scopo di questo file e` camncellare tutti i dati da database
const mongoose = require("mongoose"), //mongoose to add js to databases
	  Campground = require("./models/campground"), //sto importando mongoose.model("Campgroud", campgroundSchema);
	  Comment = require("./models/comment"); //sto importando mongoose.model("Comment", commentSchema);;

const data = [
		{
			name: "Campgroud 1",
			image: "https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false",
			description: "puffi"
		},
		{
			name: "Campgroud 2",
			image: "https://newhampshirestateparks.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg",
			description: "puffi puffi"
		},
		{
			name: "Campgroud 3",
			image: "https://cdn.jacksonholewy.net/images/content/14405_832ba2_gros_ventre_campground_lg.jpg",
			description: "puffi puffi puffi"
		}
	];

const seedDB = () => {
	Campground.deleteMany({}, (err) => {
	if(err){
		console.log(err);
	}
	console.log("removed campgrounds!");
	//aggiungiamo dei camground trial i cui dati sono salvai in data
	//NB: la logica di aggiunta dei campground sta nella callback del remove aggiungo i camground dopo averli rimossi 
	//1 loop nel array data
	//2 element in questo caso e` uno degli oggetti nell`array data
	data.forEach((seed) => { //1
		
		Campground.create(seed, (err, campground) => { //2
		
		if(err) {
			
			console.log(err);
		
		} else {
			
					console.log("NEWLY CREATED CAMPGROUND: ");
					Comment.create({
						text: "This place is very cool",
						author: "Lorenzo"
					},(err, comment)=> {
						campground.comments.push(comment);
						campground.save();
						console.log("created new comment");
					});

				}
	
			});
	  	});
	  });

	}

//esportero` questo file in app.js
module.exports = seedDB;















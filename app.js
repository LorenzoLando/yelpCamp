  //possiamo richiedere i pacchetti con una sintassi simil-oggetto
const express = require("express");
	  locus = require("locus"), //per fare debugging
	  app = express(), //creo una istanza di esxpress
	  viewEngine = require("view-engine"), //per eliminare ejs estensioni
	  bodyParser = require("body-parser"), //faccio il require del bodyparser
	  mongoose = require("mongoose") //mongoose to add js to databases

//mi connetto al database
mongoose.connect("mongodb://localhost:27017f/yelp_camp", {useNewUrlParser: true});
//utilizzo view engine per aggiungere ejs extensions
app.set("view engine", "ejs");
//setto l`utilizzo del bodyparser pacchetto che permette di la request.body in un oggetto js
app.use(bodyParser.urlencoded({ extended: true })); 
//schema setup 
const campgroundSchema = new mongoose.Schema({
	name:String,
	image:String,
	description: String
});
//inizializzo l`oggetto definendolo sulla base del modello
const Campground = mongoose.model("Campgroud", campgroundSchema);

//inizializzo il database creando un primo record
//create accetta due argomenti un oggetto che passa i dati e una funzione per l`error handling
// Campground.create(
// 	{
// 		name: "Lorenzo First",
// 		image: "https://images.unsplash.com/photo-1565775501514-4db91a79ee67?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80",
// 		description: "This is the street life campground"
// 	}, 
	
// 	(err, campground) => {
		
// 		if(err) {
// 			console.log(err);
// 		} else {
// 			console.log("NEWLY CREATED CAMPGROUND: ");
// 			console.log(campground);
// 		}
	
// });

app.get("/", (req, res) => {
  res.render("landing");
}); 

//INDEX -  RESTFUL ROUTING STRUCTURE it shows a list of all items
//quando c`e` una get request /campgrounds 
	app.get("/campgrounds", (req, res) => {
		//devo ottenere i campgrounds dal database
		Campground.find({}, (err, allCampgrounds) => { 
			if(err){
				console.log(err);
			} else {
				console.log(allCampgrounds);
				//renderizzo il file campgrounds passando la variabile contenete tutti i campgrounds dal database
				res.render("index", { campgrounds: allCampgrounds});
			}
		});
	});

//CREATE -  RESTFUL ROUTING STRUCTURE e` il form per aggiungere un item
	app.post("/campgrounds", (req, res) => {
  		var name = req.body.name;
  		var image = req.body.image;
		var description = req.body.description;
		var newCampground = {name: name, image: image, description: description};
				//create a new campground e lo inseriscilo nel database
				Campground.create(newCampground, (err, added) => {
					if(err) {
						console.log(err)
					} else {
						//ci sono due /campground, lo manda in quello corretto perche` get ha la priorita`
						//dopo la post request re-indirizzo nella pagina campground	
						res.redirect("/campgrounds");	
					}
				});
	});

//NEW -  RESTFUL ROUTING STRUCTURE mostra la form attraverso la quale possimao creare un nuovo item
app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

//SHOW -  RESTFUL ROUTING STRUCTURE mostra le info a proposito di uno specifico item 
app.get("/campgrounds/:id", (req, res) => {
	//trovare il campground con l`id fornito
	Campground.findById(req.params.id, (err, foundCampground)=> {
		if(err) {
			console.log(err);
		} else {
			//render la pagina show con il campground predefinito
			res.render("show", {campground: foundCampground});
		}
	});
	
}); 

//Mi connetto al server NB: questa riga puo` andare in qualunque posizione del file il metodo viene richiamato ogni volta 
//che viene fatta una richiesta in questo port.
//il codice apre il port a ricevere richieste http
app.listen(3000, () => {
  console.log("YelpCamp app server has started!!!!!");
});





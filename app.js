//possiamo richiedere i pacchetti con una sintassi simil-oggetto
const express = require("express"),
	  locus = require("locus"), //per fare debugging
	  app = express(), //creo una istanza di esxpress
	  viewEngine = require("view-engine"), //per eliminare ejs estensioni
	  bodyParser = require("body-parser"), //faccio il require del bodyparser serve a rendere il body un oggetto javascript
	  mongoose = require("mongoose"), //mongoose to add js to databases
	  Campground = require("./models/campground"), //sto importando mongoose.model("Campgroud", campgroundSchema);
	  seedDB = 	require("./seeds");	


seedDB();

//mi connetto al database
mongoose.connect("mongodb://localhost:27017f/yelp_camp_v3", {useNewUrlParser: true});
//utilizzo view engine per aggiungere ejs extensions
app.set("view engine", "ejs");
//setto l`utilizzo del bodyparser pacchetto che permette di la request.body in un oggetto js
app.use(bodyParser.urlencoded({ extended: true })); 

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



//quando la richiesta viene fatta a "/"
//faccio il rendering della landig page
app.get("/", (req, res) => {
  res.render("landing");
});



//INDEX -  RESTFUL ROUTING STRUCTURE it shows a list of all items
//1 quando c`e` una get request /campgrounds 
//2 devo ottenere i campgrounds dal database
//3 renderizzo il file campgrounds passando la variabile contenete tutti i campgrounds dal database
	app.get("/campgrounds", (req, res) => { //1
		
		Campground.find({}, (err, allCampgrounds) => { //2
			if(err){
				console.log(err);
			} else {
				//console.log(allCampgrounds);
				res.render("campgrounds/index", { campgrounds: allCampgrounds}); //3
			}
		});
	});

//CREATE -  RESTFUL ROUTING STRUCTURE e` il form per aggiungere un item
//CREATE e lo step di aggiunta al database
//1 setto i parametri che mi arrivano dalla post request contenuti nell`oggetto req.body
//1.2 create a new campground e lo inseriscilo nel database
//2 ci sono due /campground, lo manda in quello corretto perche` get ha la priorita`
//2 dopo la post request re-indirizzo nella pagina campground	

	app.post("/campgrounds", (req, res) => {
		
  		var name = req.body.name;
   		var image = req.body.image;
		var description = req.body.description;
		var newCampground = {name: name, image: image, description: description};
				Campground.create(newCampground, (err, added) => { //1.2
					if(err) {
						console.log(err)
					} else {
						
						res.redirect("campgrounds/campgrounds");	//2
					}
			});
	});

//NEW -  RESTFUL ROUTING STRUCTURE mostra la form attraverso la quale possimao creare un nuovo item
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//SHOW -  RESTFUL ROUTING STRUCTURE mostra le info a proposito di uno specifico item 
//1 trovare il campground con l`id fornito
//2 render la pagina show con il campground richiesto
app.get("/campgrounds/:id", (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground)=> { //1
		if(err) {
			console.log(err);
		} else {
		    res.render("campgrounds/show", {campground: foundCampground}); //2
		}
	});
	
}); 


//////////////////////////////////////////////////////////////////////////////////////////
//ROUTES PER I COMMENTI
//////////////////////////////////////////////////////////////////////////////////////////

//NEW--RESTFUL ROUTING STRUCTURE serve a mostrare il form attraverso il quale possiamo creare un nuovo commento
//1-quando avviene una http request 
//2- faccio il render di un file new.ejs
//3 trovo i camground by id dallo url
//4 il campground ottenuto lo invio come variabile al template che renderizzo
app.get("/campgrounds/:id/comments/new", (req, res) => { //1
	Campground.findById(req.params.id, (err, campground)=> {
		if(err) {
			console.log(err);
		} else {
			
			res.render("comments/new", {campground: campground}); //4
		}
	})
	
}); 








//Mi connetto al server NB: questa riga puo` andare in qualunque posizione del file il metodo viene richiamato ogni volta 
//che viene fatta una richiesta in questo port.
//il codice apre il port a ricevere richieste http
app.listen(3000, () => {
  console.log("YelpCamp app server has started!!!!!");
});





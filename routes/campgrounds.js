const express = require("express"),
	  router = express.Router(),
	  Campground = require("../models/campground");


//INDEX -  RESTFUL ROUTING STRUCTURE it shows a list of all items
//1 quando c`e` una get request /campgrounds 
//2 devo ottenere i campgrounds dal database
//3 renderizzo il file campgrounds passando la variabile contenete tutti i campgrounds dal database
	router.get("/", (req, res) => { //1
		
		Campground.find({}, (err, allCampgrounds) => { //2
			if(err){
				console.log(err);
			} else {
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

	router.post("/", isLoggedIn,(req, res) => {
		
  		var name = req.body.name;
   		var image = req.body.image;
		var description = req.body.description;
		var author = {
			id: req.user._id,
			username: req.user.username
		}
		var newCampground = {name: name, image: image, description: description, author: author};
				Campground.create(newCampground, (err, added) => { //1.2
					if(err) {
						console.log(err)
					} else {
						res.redirect("campgrounds");	//2
						
				}
			});
	});

//NEW -  RESTFUL ROUTING STRUCTURE mostra la form attraverso la quale possimao creare un nuovo item
	router.get("/new",isLoggedIn, (req, res) => {
	  res.render("campgrounds/new");
	});

//SHOW -  RESTFUL ROUTING STRUCTURE mostra le info a proposito di uno specifico item 
//1 trovare il campground con l`id fornito
//siccome i commenti sono riferiti tramite gli id devo popolare il campeggio trovato con gli effettivi commenti in modo da poterli renderizzare sulla pagina 
//2 render la pagina show con il campground richiesto
	router.get("/:id", (req, res) => {

		Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=> { //1
			if(err) {
				console.log(err);
			} else {

				res.render("campgrounds/show", {campground: foundCampground}); //2

			}
		});

	}); 

//definisco il middlware per quanto riguarda l`autenticazione
//la funzione verra` utilizzata come middleware 
//1 se sei autenticato con una funzionalita` offerta da passport
//2 eseguo la funzione successiva grazie a next()
//3 if non autenticato reindirizzo su /login
function isLoggedIn (req, res, next) {
	if(req.isAuthenticated()) { //1
	   		return next(); //2
	 }
	 res.redirect("/login"); //3
}


module.exports = router;

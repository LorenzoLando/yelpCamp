//richiedo esprss e il metodo router cosi posso routering with router anziche app
//1 mergeParams : true permette di mescolare i parametri tra campground e comment, in questa maniera posso accede gli id
const express = require("express"),
	  router = express.Router({mergeParams : true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");

//////////////////////////////////////////////////////////////////////////////////////////
//ROUTES PER I COMMENTI
//////////////////////////////////////////////////////////////////////////////////////////
//NEW--RESTFUL ROUTING STRUCTURE serve a mostrare il form attraverso il quale possiamo creare un nuovo commento
//1-quando avviene una http request a /campgrounds/:id/comments/new"
//2- faccio il render di un file new.ejs
//3 trovo i camground by id dallo url
//4 il campground ottenuto lo invio come variabile al template che renderizzo
//5 isLoggedIn controlla se sei autenticato
	//se lo sei ti indirizza al form di aggiunta commenti
	//se non lo fai ti re-indizzia a login -nella definizione si isloggedin 
router.get("/new",isLoggedIn, (req, res) => { //1
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground}); //4
		}
	})
	
}); 



//CREATE -  RESTFUL ROUTING STRUCTURE e` il form per aggiungere un item
//CREATE e lo step di aggiunta al database 
//1 lookup campground using ID
//2 se errore rindirizzo alla pagina campground
//3 se non e` errore creo un commento con i parametri passati dal form che si trovano nell`oggetto comment perche comment[text]
//4 pusho il commento nel campground che ho trovato
//5 rendirizzo alla pagina del campgrounde relativo
router.post("/campgrounds/:id/comments", (req, res) => {
	
	Campground.findById(req.params.id, (err, campground) => { //1
	 	if(err) {
			console.log(err);
			res.redirect("/campgrounds"); //2
		} else {
			Comment.create(req.body.comment, (err, comment) => { //3
				if(err){
				   console.log(err);
				} else {
					
					campground.comments.push(comment); //4
					campground.save();
					res.redirect(`/campgrounds/${campground._id}`); //5
				}
		 
		 });
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




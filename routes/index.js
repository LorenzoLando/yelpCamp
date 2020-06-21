const express = require("express"),
	  router = express.Router(),
	  passport = require("passport"), //richiedo passport
	  User = require("../models/user"); //richiedo passport


//quando la richiesta viene fatta a "/"
//faccio il rendering della landig page
router.get("/", (req, res) => {
  res.render("landing");
});


//=======================
// AUTH ROUTES
//questa e` la sezione che gestisce le routes di autenticazione dell`utente
//====================

//mostra pagina per la registrazione
router.get("/register", (req, res) => {
	res.render("register");
});

//logica del sign in form
//1 creo un nuovo user inserendo nel database lo username inserito nel form
//2 creo una registrazione salvando nel database una password che viene criptata
//3 in caso di errore renderizzo la pagina di registrazione
//4 log e ti riporto su campground passport.autenticate take care of all the process
router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username}); //1
	User.register(newUser, req.body.password, (err, user) => { //2
		if(err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, () => {
			res.redirect("/campgrounds"); //4
		});
	});
});



//=======================
// LOGIN ROUTES
//questa e` la sezione che gestisce le routes il login dell`utente
//====================

//mostra pagina per il login
router.get("/login", (req, res) => {
	res.render("login");
});



//logica del sign in form
//1 l`autenticazione si fa tramite middleware il metodo autenticate deriva  da * 
//per middleware si intende una funzionalita` che si esegue prima della callback
//e la stessa funzione autenticate che si carica in register route
router.post("/login", passport.authenticate("local", // *
		    {
				successRedirect: "/campgrounds",
				failureRedirect: "/login"
			
	}), (req, res) => {
	 
});


//=======================
//LOGOUT ROUTES
//questa e` la sezione che gestisce le routes il logout dell`utente
//====================


//gestisci la richiesta di logout
//1 .logout() e` una funzionalita` costruita dentro il pacchetto passport
//2 re-indirizzo su campground
router.get("/logout", (req, res) => {
	req.logout(); //1
	res.redirect("/campgrounds"); //2
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


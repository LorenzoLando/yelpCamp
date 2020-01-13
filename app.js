//possiamo richiedere i pacchetti con una sintassi simil-oggetto
const express = require("express"),
	  locus = require("locus"), //per fare debugging
	  app = express(), //creo una istanza di esxpress
	  viewEngine = require("view-engine"), //per eliminare ejs estensioni
	  bodyParser = require("body-parser"), //faccio il require del bodyparser serve a rendere il body un oggetto javascript
	  mongoose = require("mongoose"), //mongoose to add js to databases
	  passport = require("passport"), //richiedo passport
	  LocalStrategy = require("passport-local"), //richiedo la strategia di autenticazione
	  Campground = require("./models/campground"), //sto importando mongoose.model("Campgroud", campgroundSchema);
	  Comment = require("./models/comment"), //sto importando mongoose.model("Comment", commentSchema);
	  User = require("./models/user"), //importo lo usershcema per il database
	  seedDB = 	require("./seeds");	



//mi connetto al database
mongoose.connect("mongodb://localhost:27017f/yelp_camp_v3", {useNewUrlParser: true});
//utilizzo view engine per aggiungere ejs extensions
app.set("view engine", "ejs");
//utilizzo il file statico css  //dirname e la directory nella quale vive il file
//senza di questo anche se ho richiesto un file nel file header non sa dove andare a prenderlo.
app.use(express.static(__dirname + "/public"));  
//setto l`utilizzo del bodyparser pacchetto che permette di la request.body in un oggetto js
app.use(bodyParser.urlencoded({ extended: true })); 

seedDB();


//PASSPORT CONFIGURATION
//1 secret is used for securyty reasons to set the cookie
app.use(require("express-session")({
	secret: "Once again this is the deconding phase", //1
	resave: false,
	saveUninitialized: false
}));

//2 settaggio del metodo di autenticazione che utilizzero` in seguito  = *
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//configuro il middleware in modo che req.user venga passato a tutte le routes mi serve in tutto gli head
//1 lo passo alla res in modo che la variabile sia disponibile sempre
//2 nex() fa passare alle linee di codice successive
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

//end of passport configuration

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
						res.redirect("campgrounds");	//2
						
				}
			});
	});

//NEW -  RESTFUL ROUTING STRUCTURE mostra la form attraverso la quale possimao creare un nuovo item
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//SHOW -  RESTFUL ROUTING STRUCTURE mostra le info a proposito di uno specifico item 
//1 trovare il campground con l`id fornito
//siccome i commenti sono riferiti tramite gli id devo popolare il campeggio trovato con gli effettivi commenti in modo da poterli renderizzare sulla pagina 
//2 render la pagina show con il campground richiesto
app.get("/campgrounds/:id", (req, res) => {
	
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=> { //1
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
//1-quando avviene una http request a /campgrounds/:id/comments/new"
//2- faccio il render di un file new.ejs
//3 trovo i camground by id dallo url
//4 il campground ottenuto lo invio come variabile al template che renderizzo
//5 isLoggedIn controlla se sei autenticato
	//se lo sei ti indirizza al form di aggiunta commenti
	//se non lo fai ti re-indizzia a login -nella definizione si isloggedin -
app.get("/campgrounds/:id/comments/new",isLoggedIn, (req, res) => { //1
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
app.post("/campgrounds/:id/comments", (req, res) => {
	
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



//=======================
// AUTH ROUTES
//questa e` la sezione che gestisce le routes di autenticazione dell`utente
//====================

//mostra pagina per la registrazione
app.get("/register", (req, res) => {
	res.render("register");
});

//logica del sign in form
//1 creo un nuovo user inserendo nel database lo username inserito nel form
//2 creo una registrazione salvando nel database una password che viene criptata
//3 in caso di errore renderizzo la pagina di registrazione
//4 ti loggo e ti riporto su campground
app.post("/register", (req, res) => {
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
app.get("/login", (req, res) => {
	res.render("login");
});



//logica del sign in form
//1 l`autenticazione si fa tramite middleware il metodo autenticate deriva  da * 
//per middleware si intende una funzionalita` che si esegue prima della callback
//e la stessa funzione autenticate che si carica in register route
app.post("/login", passport.authenticate("local", // *
										 
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
app.get("/logout", (req, res) => {
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



//Mi connetto al server NB: questa riga puo` andare in qualunque posizione del file il metodo viene richiamato ogni volta 
//che viene fatta una richiesta in questo port.
//il codice apre il port a ricevere richieste http
app.listen(3000, () => {
  console.log("YelpCamp app server has started!!!!!");
});





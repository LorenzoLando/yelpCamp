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


//importo le varie route dalla cartella routes
const commentRoutes = require("./routes/comments"),
	  campgroundRoutes =  require("./routes/campgrounds"),
	  indexRoutes = require("./routes/index");



//mi connetto al database
mongoose.connect("mongodb://localhost:27017f/yelp_camp_v3", {useNewUrlParser: true});
//utilizzo view engine per aggiungere ejs extensions
app.set("view engine", "ejs");
//utilizzo il file statico css  //dirname e la directory nella quale vive il file
//senza di questo anche se ho richiesto un file nel file header non sa dove andare a prenderlo.
app.use(express.static(__dirname + "/public"));  
//setto l`utilizzo del bodyparser pacchetto che permette di la request.body in un oggetto js
app.use(bodyParser.urlencoded({ extended: true })); 

//seedDB();


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

//rendo possibile utilizzare per app le routes definite in altri files
//1 /campgrands is defines in app.use because is common to all the routes in that folder, just to dry up the code
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes); //1
app.use("/campgrounds/:id/comments", commentRoutes);





//Mi connetto al server NB: questa riga puo` andare in qualunque posizione del file il metodo viene richiamato ogni volta 
//che viene fatta una richiesta in questo port.
//il codice apre il port a ricevere richieste http
app.listen(3000, () => {
  console.log("YelpCamp app server has started!!!!!");
});





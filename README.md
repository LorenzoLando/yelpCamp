Documentation:
Project structure:
================================================================================
APP.JS

file principale contiene l'importazione di:
1-pacchetti
2-modelli per il database
3-routes

contiene inoltre le configurazione del middleware per la gestione dell'auenticazione e login


================================================================================
MODEL FOLDER

cartella che contine i modelli per i record del database
campground.js: contiene lo schema per i record dei campground
comment.js : contiene lo schema per creare i commenti 
seedstest.js : contiene la funzione che inizializza il progetto, rimuove i precedenti 				   record e ne inserisce di fittizzi con commenti random

======================================================================================
VIEWS FOLDER:
-folder per servire i file ejs.

CAMPGROUND FOLDER:
contiene i vari file ejs da renderizzare nel caso ci sia una get request che riguarda campground


COMMENTS FOLDER:

contiene i vari file ejs da renderizzare nel caso ci sia una get request che riguarda comments
patials: contiene i file ejs da renderizzare per header and footer

======================================================================================

ROUTES FOLDER

gestisce il routing 


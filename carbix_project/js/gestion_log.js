/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

window.addEventListener("load",initLogin);
window.addEventListener("load",initState);

function initState(){ // initialise l'état de la page
  let identite = document.body.dataset.personne;
  if (identite == null)
    etatDeconnecte();
  else{
    identite = JSON.parse(identite);
    if (identite.pseudo == null)
      etatDeconnecte();
    else
      etatConnecte(identite);
 }
}

function initLogin(){
	document.forms.form_login.addEventListener('submit',sendLogin); // envoi
  document.forms.form_login.addEventListener('input',function(){this.message.value='';}); // effacement auto du message
	document.querySelector('#logout').addEventListener('click',sendLogout);
	let buttonLogin = document.getElementById("connexion");
	buttonLogin.addEventListener("click",displayPageLogin);
	document.forms.form_register.addEventListener('submit',saveNewAccount);
  document.forms.form_register.addEventListener('input',function(){this.message.value='';}); // effacement auto du message
	for(let buttonRegister of document.querySelectorAll(".creationCompte"))
		buttonRegister.addEventListener("click",displayPageRegister);
}

/**
* Connecte un utilisateur passer par le formulaire d'authentification
*/
function sendLogin(ev){ // gestionnaire de l'évènement submit sur le formulaire de login
  ev.preventDefault();
  let url = "services/login.php";
  fetchFromJson(url, {method:"post",body:new FormData(this),credentials:'same-origin'})
  .then(processAnswer)
  .then(etatConnecte,function(error){
    // affiche error.message dans l'élément OUTPUT.
    let outPut = document.forms.form_login.message;
    outPut.value = "échec d'authenfication => " + error.message;
    outPut.style.color = "red";
  });
}

/**
* Déconnecte un utilisateur connecté.
*/
function sendLogout(ev){ // gestionnaire de l'évènement click sur le bouton logout
  ev.preventDefault();
  let url = "services/logout.php";
  let options = {credentials : 'same-origin'};
  fetchFromJson(url,options)
  .then(processAnswer)
  .then(etatDeconnecte);
}

function etatDeconnecte() { // passe dans l'état 'déconnecté'
    // cache ou montre des éléments
    for (let elt of document.querySelectorAll('.connecte'))
       elt.hidden=true;
    for (let elt of document.querySelectorAll('.deconnecte'))
       elt.hidden=false;
    // nettoie la partie personnalisée :
    currentUser = null;
    delete(document.body.dataset.personne);
    chargePageAccueil1();
    let buttonAccueil = document.getElementById('pageAccueil');
    buttonAccueil.style.backgroundColor = "blue";
    buttonAccueil.style.color = "white";
}

function etatConnecte(personne) { // passe dans l'état 'connecté'
    currentUser = personne;
    // cache ou montre des éléments
    for (let elt of document.querySelectorAll('.deconnecte'))
       elt.hidden=true;
    for (let elt of document.querySelectorAll('.connecte'))
       elt.hidden=false;
   	chargePageAccueil();
    document.getElementById('pageGestionProfil').innerHTML = currentUser.pseudo;
}

/**
* Affiche le formulaire d'authentification.
*/
function displayPageLogin(){
	//Pour gérer le cangement de couleur des boutons de navigation 
	gestionColorNav(this);
	//Tout les blocs à masquer.
  for(let elt of document.querySelectorAll('#accueil,#register,.recherche,#profil,#mesPosts'))
    elt.hidden = true;
  document.getElementById("blocLogin").hidden = false;
    //pour vider les input du formule à chaque fois qu'il sera affiché
    let allInputUpdate = document.querySelectorAll("#blocLogin input");
    for(elmt of allInputUpdate)
      elmt.value = '';
  document.forms.form_login.message.value='';
}

/**
* Affiche le formulaire de création de compte et masque tout autre bloc.
*/
function displayPageRegister(){
	let buttonCreeCompte = document.querySelector(".creationCompte");
	buttonCreeCompte.style.backgroundColor = "blue";
	buttonCreeCompte.style.color = "white";
	for (let elt of document.querySelectorAll('header>nav>button')){
      elt.style.backgroundColor = 'lightgrey';
      elt.style.color = 'black';
  	}
	let blocRegister = document.getElementById("register");
  	blocRegister.hidden = false;
  //Les autres blocs qui ne seront pas affichés.
  for(let elt of document.querySelectorAll('#accueil,#blocLogin,.recherche,#profil,#blocPost'))
    elt.hidden = true;
  let allInputUpdate = blocRegister.querySelectorAll("input");
  for(elmt of allInputUpdate)
    elmt.value = '';

  document.forms.form_register.message.value=''; // effacement auto du message
}

/**
* Enregistre le nouveau compte crée.
*/
function saveNewAccount(ev){
	ev.preventDefault();
	let url = "services/createUtilisateur.php";
	fetchFromJson(url,{method:"post",body:new FormData(this),credentials:'same-origin'})
	.then(processAnswer)
	.then(displayPageCreateOk,function(error){
    // affiche error.message dans l'élément OUTPUT.
    let outPut = document.forms.form_register.message;
    outPut.value = "échec de creation => " + error.message;
    outPut.style.color = "red";
  });
	
}

//Aprèes la creation d'un compte on est directement rediriger vers la page de connexion.
function displayPageCreateOk(user){
	displayPageLogin();
	let buttonLogin = document.getElementById("connexion");
	buttonLogin.style.backgroundColor = "blue";
	buttonLogin.style.color = "white";
	let outPut = document.forms.form_login.message;
	outPut.value = `${user.pseudo} votre compte à bien été crée`;
	outPut.style.color = "green";
}

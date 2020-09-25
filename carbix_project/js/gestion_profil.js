/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

window.addEventListener('load',listenerProfil);

function listenerProfil(){
	let buttonProfil = document.getElementById("pageGestionProfil");
  	buttonProfil.addEventListener("click",initProfil);
  	document.forms.upload_image.addEventListener('submit',sendForm);
}

function initProfil(){
  let url = `services/findUtilisateur.php?pseudo=${currentUser.pseudo}`;
  fetchFromJson(url)
  .then(processAnswer)
  .then(displayPageProfil,function(){});
}

/*
* Génère le code html du bloc mon profil, affiche et masque les blocs selon la necessité.
* userInfo => les informations de l'utilisateur.
* auteurPost => vaut flase si le profil afficher est celui de l'utilisateur connecté et le pseudo d'un 
*               utilisateur si le profil à afficher n'est pas celui de l'utilisateur connecté.
* NB: Cette même fonction est reutilisé pour l'affichage d'un profil depuis les posts d'une station sur la page de recherche.
*/
function displayPageProfil(userInfo,auteurPost=false){

  //Pour gérer le changement de couleur des boutons de navigation 
  let buttonProfil = document.getElementById("pageGestionProfil");
  gestionColorNav(buttonProfil);

  //L'avatar de l'utilisateur 
  if (auteurPost == false){
  	updateAvatar('avatar',currentUser.pseudo);
    //Pour que sur le bouton de navigation profil le pseudo de l'utilisateur soit dessus
    document.getElementById('pageGestionProfil').innerHTML = `Mon profil`;
  }
  else{ 
    updateAvatar('avatar',auteurPost);
    //Pour que su le bouton de navigation profil le pseudo du profil de l'auteur consulté apparaisse.
    document.getElementById('pageGestionProfil').innerHTML = `Profil => ${auteurPost}`;

  }

  //Afficher et masquer certains bloc.

  let pageProfil = document.getElementById('profil');
  pageProfil.hidden = false;
  //Tous les autres blocs qui ne seront pas affichés
  for (let elt of document.querySelectorAll('.recherche,#blocLogin,#register,#accueil,#form_updateProfil,#blocPost'))
       elt.hidden=true;

  let blocUser = document.getElementById("user");
  let blocInfoUser = document.getElementById("infoUser");
  let contenu = `<h2><em>${userInfo.pseudo}</em></h2>`;
  if (userInfo.mail == null && userInfo.ville == null && userInfo.description == null){
    if (currentUser.pseudo == userInfo.pseudo){
      contenu += "<p id = 'alerte'>Votre page est un peu vide penser à modifier vos informations !</p>";
  	  blocUser.innerHTML = `${contenu}<button id = "modifierProfil">Modifier</button>`;
  	  document.getElementById('alerte').style.color = 'red';
    }
    else{
      contenu += "<p>Cette partie n'a pas été remplie par l'utilisateur</p>";
      //document.getElementById('uploadAvatar').hidden = true;
  	  blocUser.innerHTML = `${contenu}<button id = "modifierProfil">Modifier</button>`;
    }
  }
  else{
  	//Ces tests sont faites pour n'afficher que les renseignements fournis.
    if (userInfo.mail != null) contenu += `<p><strong>Mail: </strong><span>${userInfo.mail}</span></p>`;
    if (userInfo.ville != null) contenu += `<p><strong>Ville: </strong><span>${userInfo.ville}</span></p>`;
    if (userInfo.description != null) contenu += `<p><strong>Description: </strong><span>${userInfo.description}</span></p>`;
  	blocUser.innerHTML = `${contenu}<button id = "modifierProfil">Modifier</button>`;
  }
  contenu = `<p><strong>Nombre d'avis: </strong> <em>${userInfo.nbavis}</em>
              <p><strong>Nombre de posts: </strong> <em>${userInfo.nbposts}</em>
              <p><strong>Nombre de likes: </strong> <em>${userInfo.nblike}</em>
              <p><strong>Nombre de no likes: </strong> <em>${userInfo.nbnolike}</em>
              <p><strong>Nombre total: </strong> <em>${userInfo.total}</em>
            `;
  //Masquer les bouttons update avatar et modifier profil si un utilisateur consulte le compte d'un autre
  if (currentUser.pseudo != userInfo.pseudo){
  	document.getElementById('modifierProfil').hidden = true;
    document.getElementById('uploadAvatar').hidden = true;
  }
  //Sinon les afficher
  else{
  	document.getElementById('modifierProfil').hidden = false;
    document.getElementById('uploadAvatar').hidden = false;
  }

  blocInfoUser.textContent = "";
  blocInfoUser.innerHTML = contenu;
  document.getElementById('upload_image').hidden = true; //Masquer le formulaire upload_image.
  initUpdateProfil();
  document.getElementById('uploadAvatar').addEventListener('click',displayPageUpdateAvatar);
}

function initUpdateProfil(){
	let modifierProfil = document.getElementById('modifierProfil');
	document.forms.form_updateProfil.addEventListener('input',function(){this.message.value='';});
	let form_updateProfil = document.getElementById("form_updateProfil");
	//L'événement click sur le bouton modifier affichera le formulaire de modification.
	modifierProfil.addEventListener("click",displayPageModifieProfil);
	document.forms.form_updateProfil.addEventListener('submit',sendFormUpdate);
}

function displayPageModifieProfil(){
	//Afficher et masquer certains blocs selon la necessité.
	let pageProfil = document.getElementById('profil');
  	pageProfil.hidden = true;
  	let pageUpdate = document.getElementById("form_updateProfil");
  	pageUpdate.hidden = false;
  	let allInputUpdate = form_updateProfil.querySelectorAll("input");
	for(elmt of allInputUpdate)
		elmt.value = '';//Pour vider les input de ce formulaire avant chaque affchage.
  document.forms.form_updateProfil.message.value='';
}

function sendFormUpdate(ev){
	ev.preventDefault();
	let url = "services/updateProfil.php";
	fetchFromJson(url,{method:"post",body:new FormData(this),credentials:'same-origin'})
	.then(processAnswer)
	.then(displayPageProfil,errorUpdateProfil);
  //displayPageProfil est appllé ici avec un seul paramètre et l'autre est par defaut car le profil à afficher est celui de l'utilisateur connecté. 
}

function errorUpdateProfil(error){
	let outPut = document.forms.form_updateProfil.message;
	outPut.value = `${currentUser.pseudo} => ${error.message}!`;
	outPut.style.color = "red";
}

function displayPageUpdateAvatar(){
	document.getElementById('upload_image').hidden = false;
	let pageProfil = document.getElementById('profil');
  	pageProfil.hidden = true;
  	let pageUpdate = document.getElementById("form_updateProfil");
  	pageUpdate.hidden = true;
  	document.forms.upload_image.addEventListener('input',function(){this.message.value='';});
}


/*
* Listener de l'évènement 'submit' sur le formulaire
* la fonction s'exécute donc dans le contexte du formulaire (this = le formulaire)
*/
function sendForm(ev){ // ev : Event
  ev.preventDefault(); // empêche l'envoi 'normal' du formulaire
  let formData = new FormData(this); // objet contenant les données du formulaire
  let url = this.action;
  fetchFromJson(url, {method : 'post', body : formData, 'credentials': 'same-origin'})
  .then(processAnswer)
  .then(function(){initProfil();},function(error){
  	document.forms.upload_image.message.value = error.message;
  	document.forms.upload_image.message.style.color = 'red';
  });
  // envoi du formulaire en mode post. la réponse, si elle est reçue, sera traitée par afficheResultat
}

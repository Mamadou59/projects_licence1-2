/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

window.addEventListener('load',initAccueil);

var currentUser = null; //objet "l'identifiant de l'utilisateur => pseudo" connecté

var listMois = ['janvier','fevrier','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','decembre'];
var map; // une variable globale pour la carte
var curenteIdStation = null; // qui prendra l'id de la station station courante 
var curenteStation = null; // qui prendra l'objet station courant
var infoCurenteStation = null; // qui prendra le infos de la station => prix et services
var marque = false; //Une variable si elle est à false ce que l'on est passé par le formulaire pour afficher les stations 
                    // et à true toute fois qu'on click sur à la page d'accueil la marque d'une station pour l'afficher.

function initAccueil(){
  //Pour la page d'accueil.
  chargePageAccueil();

  let buttonAccueil = document.querySelector("#pageAccueil");
  buttonAccueil.addEventListener('click',chargePageAccueil1); // lors du click sur le bouton page d'accueil la page d'accueil sera charger
  let buttonPageRecherhe = document.getElementById('pageRecherche');
  buttonPageRecherhe.addEventListener("click",displayPageRecherche);// la page de recherche sera charger et afficher

  document.getElementById('nuit').hidden = true;
  document.getElementById('jour').hidden = false;

  //Pour changer la couleur de fond en mode jour.
  document.getElementById('jour').addEventListener('click',function(){
    document.body.style.backgroundColor = 'lemonchiffon';
    document.getElementById('jour').hidden = true;
    let nuit = document.getElementById('nuit');
    nuit.hidden = false;
    nuit.style.backgroundColor= 'black';
    nuit.style.color = 'white';
    for(let elt of document.querySelectorAll('.bloc'))
      elt.style.borderColor = "black";
    for(let elt of document.querySelectorAll('button'))
      elt.style.borderColor = 'green';

    document.querySelector('#form_login+p').style.color = 'black';
  });

  //Pour changer la couleur de fond en mode nuit.
  document.getElementById('nuit').addEventListener('click',function(){
    document.body.style.backgroundColor = 'black';
    document.getElementById('nuit').hidden = true;
    let jour = document.getElementById('jour');
    jour.hidden = false;
    jour.style.backgroundColor= 'white';
    jour.style.color = 'black';
    for(let elt of document.querySelectorAll('.bloc'))
      elt.style.borderColor = "blue"; 
    for(let elt of document.querySelectorAll('button'))
      elt.style.borderColor = 'green';   
    document.querySelector('#form_login+p').style.color = 'white';
  });
}

function processAnswer(answer){
  if (answer.status == "ok")
    return answer.result;
  throw new Error(answer.message);
}

function chargePageAccueil1(){
    //Pour gérer le changement de couleur des boutons de navigation 
    gestionColorNav(this);

    chargePageAccueil();
  }
/*
* Récupère les bestStations 
*/
function chargePageAccueil(){
  let buttonAccueil = document.querySelector("#pageAccueil");
  buttonAccueil.style.backgroundColor = "blue";
  buttonAccueil.style.color = "white";
  let url = 'services/findBestStations.php';
  fetchFromJson(url)
  .then(processAnswer)
  .then(displayAccueil,displayErrorAccueil);

  if (currentUser != null)
    document.getElementById('pageGestionProfil').innerHTML = `Mon profil`;

}

/*
* Génère le code html de la page d'accueil.
* tabBesrStation => un tableau dont chaque élément est un objet station.
*/
function displayAccueil(tabBestStation){
  let bestStationsToHTML = `<h3> Les ${tabBestStation.length} stations les plus notées</h3>
                            <div class='bloc'>
                            `;
  for(i=0;i<tabBestStation.length;i++){
    if (i == 5){
      bestStationsToHTML += "</div>";
      //if (i < tabBestStation.length)
        bestStationsToHTML += "<div class='bloc'>";
    }
    bestStationsToHTML += "<div class = 'bestStations'>\t";
    cur = tabBestStation[i];
    if (cur.nom != null) bestStationsToHTML += `<p><strong> Nom :</strong> <em>${cur.nom}</em> </p>`;
    bestStationsToHTML += ` <p> <strong>Marque : </strong>  <a title='Afficher' class='marque' href="." data-id= '${cur.id}'> ${cur.marque}</a></span></p>\t\t
                            <p> <strong>Adresse : </strong> <em>${cur.adresse}</em></p>\t\t
                            <p> <strong>Nombre de notes : </strong> <em>${cur.nbnotes}</em></p>\t\t
                            <p> <strong>Note globale : </strong> <em>${cur.noteglobale}</em></p>\t\t
                            <p> <strong>Note accueil : </strong> <em>${cur.noteaccueil}</em></p>\t\t
                            <p> <strong>Note prix : </strong> <em>${cur.noteprix}</em></p>\t\t
                            <p> <strong>Note service : </strong> <em>${cur.noteservice}</em></p>\t
                            </div>\n
                          `;
  }
  bestStationsToHTML += "</div>";
  let cible = document.querySelector("section#accueil");
  cible.textContent = "";
  cible.innerHTML = bestStationsToHTML;
  //declencher l'événement sur les marques
  for(marque of document.querySelectorAll('.marque'))
    marque.addEventListener("click",displayOneStation);

  for(elt of document.querySelectorAll('#blocLogin,#register,#profil,#form_updateProfil,#blocPost,.recherche,#vosPosts,#upload_image'))
      elt.hidden = true;
  
  cible.hidden = false;
}
function displayErrorAccueil(error){
  let p = document.createElement('p');
  p.textContent = "Bienvenue chez carbix ici vous trouverez tout ce qu'il vous faut pour mieux continuer votre voyage";
  let cible  = document.querySelector('section#accueil');
  cible.textContent=''; // effacement
  cible.appendChild(p); 
}
/*
* Pour l'affichage d'une seule station sur la page de recherche avec tout les renseignements affichés.
*/
function displayOneStation(ev){
  ev.preventDefault();
  curenteIdStation = this.dataset.id; // la variable globale prend l'id de la station qui declenche l'évenement
  marque = true;
  findStation(); //récuperer la station selectionnée 
  //Pour la gestion du style des boutons après le click.
  let buttonPageRecherhe = document.getElementById('pageRecherche');
  buttonPageRecherhe.style.backgroundColor = 'blue';
  buttonPageRecherhe.style.color = 'white';
  let buttonAccueil = document.getElementById('pageAccueil');
  buttonAccueil.style.backgroundColor = 'lightgrey';
  buttonAccueil.style.color = "black";
}
/*Pour gérer la le cangement de couleur das boutons de navigation 
  object => l'objet qui vient de declenché un événement
*/
function gestionColorNav(object){
  for (let elt of document.querySelectorAll('header>nav>button')){
    if (elt != object){
      elt.style.backgroundColor = 'lightgrey';
      elt.style.color = 'black';
    }
    else{
      elt.style.backgroundColor = 'blue';
      elt.style.color = 'white';
    }
  }
  let buttonCreeCompte = document.querySelector(".creationCompte")
      buttonCreeCompte.style.backgroundColor = 'lightgrey';
      buttonCreeCompte.style.color = 'black';
}

/*
* L'affichage de la page de recherche lors du click sur le bouton page de recherche.
* Celle-ci sera affichée avec juste le formulaire de recherche et la carte initialement vide.
*/
function displayPageRecherche(){
  //Pour gérer la le cangement de couleur das boutons de navigation.
  gestionColorNav(this);

  //Masque tous et afficher juste le formulaire et la carte vide avant le submit valide du formulaire.
  for(let elt of document.querySelectorAll('#accueil,#blocLogin,#register,#profil,#form_updateProfil,#blocPost,#vosPosts,#notePostStation,#upload_image'))
    elt.hidden = true;

  let formRecherche = document.getElementById("formRecherche");
  let carbixCarte = document.getElementById("carbixCarte");
  formRecherche.hidden = false;
  carbixCarte.hidden = false;

  //Pour que sur le bouton de navigation profil le pseudo de l'utilisateur apparaisse.
  if (currentUser.pseudo != null)
    document.getElementById('pageGestionProfil').innerHTML = `Mon profil`;
}

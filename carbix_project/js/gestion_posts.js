/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

window.addEventListener('load',initPost);


function initPost(){
	let buttonPageGestionPost = document.getElementById("pageGestionPost");
  	buttonPageGestionPost.addEventListener("click",initMyPosts);
}

/*
* Récupère dans la base de données les posts de l'utilisateur connecté.
*/
function initMyPosts(){
  let url = `services/findMesPosts.php?pseudo=${currentUser.pseudo}`;
  fetchFromJson(url)
  .then(processAnswer)
  .then(displayPagePosts,errorDisplayPosts);
}

/*
* Génère le code HTML permettant d'afficher les posts de l'utilisateur.
*/
function displayPagePosts(mesPosts){
  let blocMesPost = document.getElementById("mesPosts");

  //Pour la couleur des boutons de navigation.
  gestionColorNav(document.getElementById('pageGestionPost'));

  blocMesPost.textContent = "";//vider le contenu.
  for(let i=0;i<mesPosts.liste.length;i++){
    curPost = mesPosts.liste[i];
    let scrollPage = document.createElement("scroll-page");
    scrollPage.id = curPost.id;
    let time = curPost.datecreation.split(' ');
    let date = time[0].split('-');
    let heure = time[1].split('+')[0].split(':');
    scrollPage.innerHTML = `
                  <span> ${curPost.titre} </span>
                  <button data-idPost = '${curPost.id}' class = 'delete' >supprimer</button>
                  <p> ${curPost.contenue} </p> 
                  <p><time datetime = ${curPost.datecreation}> <em>${date[2]} ${listMois[date[1]-1]} ${date[0]} à ${heure[0]}h${heure[1]}m${heure[2]}s</em></time>
                    <span class = 'nolike'>${curPost.nbnolike} <img src = 'images/AdobeStock_39474463.jpeg' alt=dislikes > </span>
                    <span class = 'like'>${curPost.nblike} <img src = 'images/AdobeStock_52270631.jpeg' alt=likes > </span>
                  </p>
                  `;
    blocMesPost.appendChild(scrollPage);
  }
  //Mettre en oeuvre des événements sur le boutons 'supprimer' de chaque post.
  for(buttonDel of document.querySelectorAll(".delete")){
    buttonDel.addEventListener("click",deletePost);
  }
  // Masquer ou afficher les blocs de la page selon la necessité.
  masqueOuAffichePourPost(document.getElementById('blocPost'));

  document.getElementById('pageGestionProfil').innerHTML = `Mon profil`;
}

function deletePost(){
  let idPost = this.dataset.idpost;
  let args = new FormData();
  args.append('id',idPost);
  let url = `services/deletePost.php`;
  fetchFromJson(url,{method:"post",body:args,credentials:'same-origin'})
  .then(processAnswer)
  let mesPost = document.querySelector("#blocPost");
  mesPosts.removeChild(document.getElementById(idPost)); // la suppression du fils dans le DOM des posts.
  //lorsque l'utilisateur supprime son dernier post ce message lui sera affiché.
  if (document.querySelector('.delete') == null){
  	mesPosts.textContent = "Vous venez de supprimer votre dernier post!";
  	mesPosts.style.color = 'red';
  }
  	
}
/*
* Cette fonction qui prend en paramètre l'objet du bloc à afficher et masque tout autre.
*/
function masqueOuAffichePourPost(object){
  //Masquer certains blocs
  for(let elt of document.querySelectorAll('#accueil,#profil,.recherche,#blocLogin,#register,#form_updateProfil,#vosPosts,#upload_image'))
  	elt.hidden = true;
  //Afficher le bloc des posts.
  object.hidden = false;
}
/*
* En cas d'erreur pour un utilisateur qui n'a aucun post.
*/
function errorDisplayPosts(error){
  //Pour la couleur des boutons de navigation.
  gestionColorNav(document.getElementById('pageGestionPost'));
  let p = document.createElement('p');
  p.textContent = "Vous n'avez aucun post pour l'instant n'oubliez pas de noter les stations!";
  let blocMesPost = document.getElementById('mesPosts');
  blocMesPost.textContent = "";
  blocMesPost.appendChild(p);
  masqueOuAffichePourPost(document.getElementById('blocPost'));

  document.getElementById('pageGestionProfil').innerHTML = `Mon profil`;

}


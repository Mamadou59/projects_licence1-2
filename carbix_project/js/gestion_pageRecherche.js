/* Author: Diallo Mamadou et Barry Mamadou*/
window.addEventListener("load",initPageRecherche);

function initPageRecherche(){
    dessinerCarteInit();
    document.forms.form_recherche.addEventListener("submit",lanceRequetStations);
    //Cette partie affiche un petit formulaire permettant de créer un post. 
    document.getElementById('poster').addEventListener('click',function(ev){
        ev.preventDefault();
        document.getElementById('form_noteStation').hidden = true;
        document.getElementById('form_poste').hidden = false;
        document.getElementById('formNoteEtPost').hidden = false;
        document.forms.form_poste.addEventListener('submit',poster);
        document.forms.form_poste.message.value = "";//pour vider le contenu du output en cas d'une erreur qui prècede l'affichage.
        let allInputUpdate = document.querySelectorAll("#form_poste input,#form_poste textarea");//Vider les input avant chaque affichage
        for(elmt of allInputUpdate)
            elmt.value = '';

        //vide le message d'erreur affiché.
        let outPut = document.querySelector('#infoStation>output');
        outPut.textContent = "";
    });
}
/*
* lors du chargement de la page la carte est initiallement centrée au coordonées [50.62925,3.057256].
*/
function dessinerCarteInit(){ 
    // création de la carte, centrée sur les coordonnées [50.62925,3.057256], niveau de zoom 5
    // cette carte sera dessinée dans l'élément HTML "carbixCarte"
    var allPoint = [[50.62925, 3.057256]];
    map = L.map('carbixCarte').setView([50.62925,3.057256],5);
    // ajout du fond de carte OpenStreetMap
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    map.fitBounds(allPoint);
    
}


function processRechercheAnswer(answer){
  if (answer.status == "ok")
    return answer.data;
  throw new Error(answer.message);
}

/*
* idCurAvatar : l'id permettant de selectionner où mettre l'image.  
* pseudo : le pseudo du compte concerné ça peut-être l'auteur d'un post ou l'utilisateur qui est connecté.
*/
function updateAvatar(idCurAvatar,pseudo) {
    let changeAvatar = function(blob) {
      if (blob.type.startsWith('image/')){ // le mimetype est celui d'une image
        let img = document.getElementById(idCurAvatar);
        img.src = URL.createObjectURL(blob);
      }
    };
    fetchBlob('services/getAvatar.php?pseudo='+pseudo)
    .then(changeAvatar);
}

/**
*
*
*/
function lanceRequetStations(ev){
    marque = false; // mettre à false cette variable globale car dans ce cas on est passer par un formulaire pour rechercher des stations.
    ev.preventDefault();
    let formData = new FormData(this);
    let commune = formData.get('commune');
    let carburants = (formData.getAll('carburants[]')).join();
    let rayon = formData.get('rayon');
    let url = `http://webtp.fil.univ-lille1.fr/~clerbout/carburant/recherche.php?commune=${commune}&carburants=${carburants}`;
    if(rayon != "") url += `&rayon=${rayon}`;
    fetchFromJson(url)
    .then(processRechercheAnswer)
    .then(function(result){dessinerCarteAvecPopUp(result,commune);},errorRequete);

}
/**
* Capture de l'erreur de la requêt et affiche le message d'erreur dans le output mis pour ça.
*/
function errorRequete(error){
    let outPut = document.forms.form_recherche.message;
    outPut.value = "  Error :=> " + error.message;
    outPut.style.color = "red";
}

/**
* Dessine la carte avec toute les positions des différentes stations retourné par le service.
* tabData => un tableau dont chaque élément est un objet contenant les attributs (id,latitude,longitude et distance).
* commune => la commune de la requête.
*/
function dessinerCarteAvecPopUp(tabData,commune){
    var curStation;
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    var allPoint = [];
    for(var i=0;i<tabData.length;i++){
        curStation = tabData[i];
        let distance = curStation.distance;
        distance = parseFloat(distance).toFixed(2);
        allPoint.push([curStation.latitude,curStation.longitude]);//pour le fitBounds
        var marker = L.marker([curStation.latitude,curStation.longitude]).addTo(map)
            .bindPopup(`<p>A ${distance} km de ${commune}</p><button type="button" value = ${curStation.id} class = "buttonPopUp">Afficher les détails</button>`);
    }
    map.fitBounds(allPoint);

    map.on("popupopen",activerBouton);

    //Vider le outPut après un submit sans erreur.
    document.forms.form_recherche.message.value = "";

    //Tout les éléments de la classe 'affterClickButton' seront masqués et ne s'affcheront qu'après un click sur l'un de popup.
    for(let rech of document.querySelectorAll('.afterClickButton'))
        rech.hidden = true;

    //Tout les élément de la classe 'afterSubmit' seront affichés lorsque le submit est valide.
    for(rech of document.querySelectorAll('.afterSubmit'))
        rech.hidden = false;
}

function activerBouton(ev){
    var noeudPopup = ev.popup._contentNode; // le noeud DOM qui contient le texte du popup
    var bouton = noeudPopup.querySelector("button"); // le noeud DOM du bouton inclu dans le popup
    curenteIdStation = bouton.value;//Initialiser la variable globale curenteIdStation à la station dont le popup est ouvert.
    bouton.addEventListener("click",findStation); // en cas de click, on déclenche la fonction findStation
    bouton.addEventListener('click',findPostsStation); // en même temps la fonction findPostsStation

}

/**
* Retrouve la station courante dans la base de données.
*/
function findStation(){
    let url = `services/findStation.php?id=${curenteIdStation}`;
    fetchFromJson(url)
    .then(processAnswer)
    .then(function(result){
        initCurenteStation(result);//Pour initialiser la variable gloable de la station courante.
        findInfoStation(curenteIdStation);
    },function(){});
}

/**
* Initialise la variable gloable de la station courante.
* Celle-ci est reutiliser lors du click sur la marque d'une satation affiché sur la page d'accueil.
*/
function initCurenteStation(curStation){
    curenteStation = curStation;
    if(marque) dessinerCarteAvecPopUpPourUneStation(curenteStation);// si on est passer par le click sur la marque d'une station celle-ci est positionée sur la carte  
}

/**
* Retrouver les info d'une station dont l'identifiant est passé en paramètre.
* idStation => l'identifiant d'une station.
*/
function findInfoStation(idStation){
    let url = `http://webtp.fil.univ-lille1.fr/~clerbout/carburant/infoStation.php?id=${idStation}`;
    fetchFromJson(url)
    .then(processRechercheAnswer)
    .then(function(result){
        initInfoCurenteStation(result);//Initialiser la variable globale infoCurenteStation
        displayInfoStation();
    },function(){});
}

//Initialise la variable globale infoCurenteStation.
function initInfoCurenteStation(info){
    infoCurenteStation = info;
 }

/**
* Dessine sur la carte la station dont la marque est cliquée.
* tab => un obljet dont les attribut sont (id,latitude,longitude,nbnote,noteglobal,noteaccueil,noteprix et noteservice).
*/
function dessinerCarteAvecPopUpPourUneStation(tab){
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    curStation = tab;
    var marker = L.marker([curStation.latitude,curStation.longitude]).addTo(map)
            .bindPopup(`<button type="button" value = ${curStation.id} class = "buttonPopUp">Afficher les détails</button>`);
    map.fitBounds([[curStation.latitude,curStation.longitude]]);
    map.on("popupopen",activerBouton);
    for(let rech of document.querySelectorAll('.recherche'))
        rech.hidden = false;
    document.getElementById('upload_image').hidden = true;
    document.getElementById('accueil').hidden = true;
    findInfoStation(tab.id);//Retrouver les infos de la station affichée sur la carte. Prix et services
    findPostsStation(); //Retrouver les posts de la station.
}

/**
* Produit un code HTML permettant de representer les informations d'une station donnée.
*/
function displayInfoStation(){
    let infoStation = document.getElementById('infoStation');
    infoStation.textContent = '' //Vider le contenu
    let outPut = document.createElement('output');
    outPut.name="message";
    infoStation.appendChild(outPut);
    infoStation.appendChild(document.createElement('br'));
    if (curenteStation.nom != null){
        let titreStation = document.createElement("strong");
        titreStation.textContent = curenteStation.nom
        infoStation.appendChild(titreStation);
        infoStation.appendChild(document.createElement("br"));
    }
    let pAdresse = document.createElement('p');
    pAdresse.innerHTML = `<strong>ADR :</strong> ${curenteStation.adresse}`;
    infoStation.appendChild(pAdresse);
    let pCP = document.createElement('p');
    pCP.innerHTML = `<strong>CP :</strong> ${curenteStation.cp}`;
    infoStation.appendChild(pCP);
    let titreServices = document.createElement('h3');
    titreServices.textContent = "Services";
    infoStation.appendChild(titreServices);
    let afficherServices = document.createElement('p');
    afficherServices.className = "afficherServices";
    afficherServices.innerHTML = "<strong><a href='.' title='services'><em>&darr;</em> Afficher</a></strong>";
    infoStation.appendChild(afficherServices);
    let blocServices = document.createElement('div');
    blocServices.id = "services";
    infoStation.appendChild(blocServices);

    let titrePrix = document.createElement('h3');
    titrePrix.textContent = "Prix";
    infoStation.appendChild(titrePrix);
    let afficherPrix = document.createElement('p');
    afficherPrix.className = "afficherPrix";
    afficherPrix.innerHTML = "<strong><a href='.' title='prix'><em>&darr;</em> Afficher</a></strong>";
    infoStation.appendChild(afficherPrix);
    let blocPrix = document.createElement('div');
    blocPrix.id = "prix";
    infoStation.appendChild(blocPrix);

    infoStation.hidden = false;

    //Declencher un événement sur le bouton qui affiche les services proposés par une station.
    let service = document.querySelector(".afficherServices");
    service.addEventListener('click',displayServices);
    //Declencher un événement sur le bouton qui affiche les prix des carburants proposés par une station.
    let prix = document.querySelector('.afficherPrix');
    prix.addEventListener('click',displayPrix);
    displayNote();//Affiche les notes de la station concernée.
}

/**
* Produit le code HTML permettant de répresenetr les services d'une station.
*/
function displayServices(ev){
    ev.preventDefault();
    let services = infoCurenteStation.services;
    let cible = document.getElementById('services');
    cible.textContent = "";
    //Pour un station qui ne propose aucun service
    if (services.length == 0){
        let p = document.createElement('p');
        p.textContent = "Cette station ne propose aucun service!";
        cible.appendChild(p);
    }
    else{
        for(let serv of services){
            let p = document.createElement('p');
            p.textContent = serv;
            cible.appendChild(p);
        }
    }
    //Vider le contenu du bloc prix lorsque les services sont affichés.
    let prix = document.getElementById('prix');
    prix.textContent = "";

    //vide le message d'erreur affiché.
    let outPut = document.querySelector('#infoStation>output');
    outPut.textContent = "";
}

/**
* Produit le code HTML permettant de répresenter les prix des carburant proposés par une station.
*/

function displayPrix(ev){
    ev.preventDefault();
    let price = infoCurenteStation.prix;
    let cible = document.getElementById('prix');
    cible.textContent = "";
    for(let i = 0;i<price.length;i++){
        let libel = document.createElement('strong')
        libel.id = i;
        libel.className = "prixCarb ";
        libel.innerHTML = `<a href='.' ><em>&darr;</em> ${price[i].libellecarburant}</a><br/>`;
        cible.appendChild(libel);
        let div = document.createElement('div');
        div.id = `i${i}`;
        div.className = 'contenu';
        cible.appendChild(div);
        //masquer ce div car il ne sera afficher que lors du click sur strong qui contient le libélé du carburant.
        div.hidden = true;
    }
    //Lors du click sur le libélé carburant sera affiché son prix.
    for(let elt of document.querySelectorAll('.prixCarb'))
        elt.addEventListener('click',displayValeur);
    //Vider le contenu du bloc services lorsque les prix sont affichés
    let services = document.getElementById('services');
    services.textContent = "";

    //vide le message d'erreur affiché.
    let outPut = document.querySelector('#infoStation>output');
    outPut.textContent = "";
}

/**
* Produit le code HTML permettant de répresenter le prix et la date de mise à jour de chaque type de carburant.
*/
function displayValeur(ev){
    ev.preventDefault();
    let prix = infoCurenteStation.prix;
    let cible = document.getElementById(`i${this.id}`);
    cible.textContent = "" //vider le cpntenu de la cible
    let p = document.createElement('p');
    let time = prix[parseInt(this.id)].maj.split(' ');
    let date = time[0].split('-');
    let heure = time[1].split(':');
    p.innerHTML = `<strong>Prix : </strong><span>${prix[parseInt(this.id)].valeur} €</span><br/>
                    <strong>Dernière mise à jour : </strong><span>${date[2]} ${listMois[date[1]-1]} ${date[0]} à ${heure[0]}h${heure[1]}m${heure[2]}s</span>
                    `;
    cible.appendChild(p);
    //Aficher le carburant concerné
    cible.hidden = false;
    //Masquer les autres
    for(let elt of document.querySelectorAll('.contenu')){
        if(elt != cible)
            elt.hidden = true;
    }

}


//Pour les posts de la page de recherche donc les posts d'une station.
/*
* Récupère les posts d'une station
*/
function findPostsStation(){
    let url = `services/findPosts.php?id=${curenteIdStation}`;
    fetchFromJson(url)
    .then(processAnswer)
    .then(displayPosts,displayErrorPosts);
}

function displayErrorPosts(error){
    let p = document.createElement('p');
    p.textContent = error.message;
    let blocPosts = document.querySelector('#vosPosts>scroll-container');
    blocPosts.textContent = "";
    blocPosts.appendChild(p);
}

/**
* Produit le code HTML permettant de réprésenter les posts d'une station.
* stationPosts => un tableau dont chaque élément est un objet post dont les attributs sont (id,auteur,titre,contenu,datecreation).
*/
function displayPosts(stationPosts){
    document.getElementById("vosPosts").hidden = false;
    let cible = document.querySelector('#vosPosts>scroll-container');
    cible.textContent = "";
    for(let i=0;i<stationPosts.liste.length;i++){
        curPost = stationPosts.liste[i];
        let scrollPage = document.createElement("scroll-page");
        scrollPage.id = curPost.id;
        let date = curPost.datecreation.split(' ')[0].split('-');
        scrollPage.innerHTML = `
                          <span> ${curPost.titre} </span> <span><img id=ii${curPost.id} src='' alt=${curPost.auteur} class="avatarPost"><strong><a href='.' title='afficher' class="pseudoPost" data-pseudo='${curPost.auteur}'>${curPost.auteur}</a></strong>
                          <p> ${curPost.contenue} </p> 
                          <p><time datetime = ${curPost.datecreation}> <em>${date[2]} ${listMois[date[1]-1]} ${date[0]}</em></time>
                            <span class = 'nolike'>${curPost.nbnolike} <img data-idpost=${curPost.id} src = 'images/AdobeStock_39474463.jpeg' alt='dislikes' > </span>
                            <span class = 'like'>${curPost.nblike} <img data-idpost=${curPost.id} src = 'images/AdobeStock_52270631.jpeg' alt='likes' > </span>
                          </p>
                        `;
        cible.appendChild(scrollPage);
        //Pour charger l'avatar de l'auteur du post courant.
        updateAvatar(`ii${curPost.id}`,curPost.auteur);
    }
    //Un événement click sur le pseudo de l'auteur d'un post doit afficher son profil.
    for(let elt of document.querySelectorAll('.pseudoPost'))
        elt.addEventListener('click',function(ev){ev.preventDefault(); afficheProfil(this.dataset.pseudo);});

    //Un événement click sur l'avatar de l'auteur d'un post doit afficher son profil.
    for(elt of document.querySelectorAll('.avatarPost'))
        elt.addEventListener('click',function(ev){afficheProfil(this.alt);});

    for(like of document.querySelectorAll(".like>img"))
        like.addEventListener('click',function(){likeNoLikePost(this.dataset.idpost,"like")});
    for(nolike of document.querySelectorAll('.nolike>img'))
        nolike.addEventListener('click',function(){likeNoLikePost(this.dataset.idpost,"nolike")});
}

/**
* Afficher le profil de l'auteur d'un post.
* pseudo => le pseudo de l'auteur d'un post.
*/
function afficheProfil(pseudo){
    if (currentUser == null){
        let outPut = document.querySelector('#infoStation>output');
        outPut.textContent = `==> Connectez-vous pour consulter le profil d'un utilisateur!`;
        outPut.style.color = 'red';
        return;
    }
    let url = `services/findUtilisateur.php?pseudo=${pseudo}`;
    fetchFromJson(url)
    .then(processAnswer)
    .then(function(infoUser){displayPageProfil(infoUser,infoUser.pseudo);},function(error){console.log(error)});
    //La fonction auxiliaire permettra d'appeler displayPageProfil avec deux parametre pour que l'image soit celle de l'utilisateur consulté.
}

/**
* Like ou nolike un post dont l'id est passé en paramètre.
* idPost => l'identifiant du post.
* avis => 'like' ou 'nolike'.
*/
function likeNoLikePost(idPost,avis){
    let args = new FormData();
    args.append("id",idPost);
    args.append('avis',avis);
    let url = 'services/notePost.php';
    fetchFromJson(url,{method:"post",body:args,credentials:'same-origin'})
    .then(processAnswer)
    .then(function(result){findPostsStation();},likeNoLikeError);
}

/**
* Capture l'errerur de la requête et l'affiche dans un output mis en place pour ça.
*/
function likeNoLikeError(error){
    let outPut = document.querySelector('#infoStation>output');
    outPut.textContent = `==> ${error.message}`;
    outPut.style.color = 'red';
}

/**
* Affiche les note d'une station.
*/
function displayNote(){
    document.getElementById('vosAvis').hidden = false;
    //Masquer les formulaires de note et posts
    for(elt of document.querySelectorAll('.noterPoster'))
        elt.hidden = true;
    for(elt of document.querySelectorAll('.afterClickButton'))
        elt.hidden = false;
    
    //L'événement sur le bouton donner son avis qui affiche un petit formulaire permettant de noter une station.
    document.getElementById('donneAvis').addEventListener('click',function(ev){
        ev.preventDefault();
        document.getElementById('form_noteStation').hidden = false;
        document.getElementById('formNoteEtPost').hidden = false;
        document.getElementById('form_poste').hidden = true;
        document.forms.form_noteStation.addEventListener('submit',noterStation);
        document.forms.form_noteStation.message.value = "";//pour vider le contenu du output en cas d'une erreur qui prècede l'affichage.
        let allInputUpdate = document.querySelectorAll("#form_noteStation input");
        for(elmt of allInputUpdate)
            elmt.value = '';//Vider les input avant chaque affichage
        //vide le message d'erreur affiché.
        let outPut = document.querySelector('#infoStation>output');
        outPut.textContent = "";
    });

    document.getElementById('global').innerHTML = `<strong>Note globale</strong> : (${curenteStation.noteglobale})`;
    
    //Gèrer le remplissage des couleurs des petites cases dans les avis selon la note.
    remplieLesCouleursAvis('#noteAccueil>span',curenteStation.noteaccueil);
    document.querySelector('#noteAccueil>.notes').textContent = `(${curenteStation.noteaccueil})`;

    //Gèrer le remplissage des couleurs des petites cases dans les avis selon la note.
    remplieLesCouleursAvis('#noteServices>span',curenteStation.noteservice);
    document.querySelector('#noteServices>.notes').textContent = `(${curenteStation.noteservice})`;

    //Gèrer le remplissage des couleurs des petites cases dans les avis selon la note.
    remplieLesCouleursAvis('#notePrix>span',curenteStation.noteprix);
    document.querySelector('#notePrix>.notes').textContent = `(${curenteStation.noteprix})`;



}
/*
* Gèrer le remplissage des couleurs des petites cases dans les avis selon la note
* idBloc => l'identifiant qui premettra de selectionner les cases concernées
* note => la note qui est une chaine. 
*/
function remplieLesCouleursAvis(idBloc,note){
    let lSpan = document.querySelectorAll(idBloc);
    let noteToInt = parseInt(note);
    if (note - noteToInt > 0.5) noteToInt += 1;
    var i;
    for(i=0;i< noteToInt;i++){
        lSpan[i].style.color = "blue";
        lSpan[i].style.backgroundColor = "blue";
        lSpan[i].style.borderColor = 'green';
    }
    for(i;i<lSpan.length;i++){
        lSpan[i].style.color = "white";
        lSpan[i].style.backgroundColor = "white";
        lSpan[i].style.borderColor = 'red';
    }
}

/**
* Noter la station affichée.
*/
function noterStation(ev){
    ev.preventDefault();
    let args = new FormData(this);
    args.append('id',curenteIdStation);
    let url = 'services/noteStation.php';
    fetchFromJson(url,{method:"post",body:args,credentials:'same-origin'})
    .then(processAnswer)
    .then(initCurenteStation)
    .then(function(){displayNote();},errorNote);
}
function errorNote(error){
    document.forms.form_noteStation.message.value = `==> ${error.message}`;
    document.querySelector('#form_noteStation output').style.color = 'red';
}

/**
* Laisser un post pour la station affichée.
*/
function poster(ev){
    ev.preventDefault();
    let args = new FormData(this);
    args.append('station',curenteIdStation);
    let url = 'services/createPost.php';
    fetchFromJson(url,{method:"post",body:args,credentials:'same-origin'})
    .then(processAnswer)
    .then(function(){findPostsStation();
        document.getElementById('vosAvis').hidden = false;
        document.getElementById('form_poste').hidden = true;},errorPost);
}

function errorPost(error){
    document.forms.form_poste.message.value = `==> ${error.message}`;
    document.querySelector('#form_poste output').style.color = 'red';
}

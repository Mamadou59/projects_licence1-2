/* Author: Diallo Mamadou et Barry Mamadou*/
window.addEventListener("load",dessinerCarte);

/*
* Cette fonction retourne une liste de liste dont les sous listes sont composées des coordonnées, 
* la commune et l'ID de la station et l'adresse.
*/
function returnAllPoints(){
    var l = document.querySelectorAll(".infoStation");
    var pointList = [];
    for (var i= 0; i<l.length;i++){
        var commune = l[i].dataset.ville;
        var stationId = l[i].dataset.id;
        var stationAdresse = l[i].dataset.adresse;
        var point = [l[i].dataset.lat,l[i].dataset.lon,commune,stationId,stationAdresse];
        pointList.push(point);
    }return pointList;
}
function dessinerCarte(){ 
    // création de la carte, centrée sur les premières coordonnées de la liste retournée précedement, niveau de zoom 5
    // cette carte sera dessinée dans l'élément HTML "cart"
    var pointList = returnAllPoints();
    var allPoint = [];// qui contiendra une liste de liste des coordonnées des stations.
    if(pointList.length != 0){
        var map = L.map('carte').setView([pointList[0][0],pointList[0][1]], 5);
        // ajout du fond de carte OpenStreetMap
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // positionnement des marqueur avec un popup associé
        for (var i =0;i<pointList.length;i++){
            allPoint.push([pointList[i][0], pointList[i][1]]);
            var marker = L.marker([pointList[i][0], pointList[i][1]]).addTo(map)
           .bindPopup('Une station de la commune '+pointList[i][2]+'<p>'+pointList[i][4]+'</p><button type="button" value="'+pointList[i][2]+'"data-id="'+pointList[i][3]+'">Afficher les détailes</button>');
        }
        map.fitBounds(allPoint);

        // Mise en place d'une gestionnaire d'évènement : activerBouton se déclenchera à chaque ouverture de popup
        map.on("popupopen",activerBouton);
        
        // NB : map.on() est une méthode propre à la bibliothèque Leaflet qui permet d'associer des gestionnaires
        // aux évènements concernant la carte.
        //map.on("click",afficheCoord);
    }
    
}

// gestionnaire d'évènement (déclenché lors de l'ouverture d'un popup)
// cette fonction va rendre actif le bouton inclus dans le popup en lui assocaint un gestionnaire d'évènement
function activerBouton(ev) {
    var noeudPopup = ev.popup._contentNode; // le noeud DOM qui contient le texte du popup
    var bouton = noeudPopup.querySelector("button"); // le noeud DOM du bouton inclu dans le popup
    bouton.addEventListener("click",boutonActive); // en cas de click, on déclenche la fonction boutonActive
    noeudPopup.addEventListener("dblclick",buttondesactive); //en cas de double click, on déclenche la fonction buttondesactive
}

// gestionnaire d'évènement (déclenché lors d'un click sur le bouton dans un popup)
function boutonActive(ev) {
    // this est ici le noeud DOM de <button>. La valeur associée au bouton est donc this.value
    var stationId = this.dataset.id;
    var stationContent = document.getElementById(stationId).innerHTML;
    var info = document.getElementById("info");
    //info.innerHTML = "";
    info.innerHTML = stationContent;
}
function buttondesactive(ev){
    var info = document.getElementById("info");
    info.innerHTML = "";
}

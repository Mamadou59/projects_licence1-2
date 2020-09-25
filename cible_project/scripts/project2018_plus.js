// global variable for the project

// default initial width and heigth for the target
var TARGET_WIDTH = 40;
var TARGET_HEIGHT = 40;

// chrono management
// value of time in tenth of seconds
var time = 0;
// timer variable
var chronoTimer = null;
// une variable pour stocker le niveau choisi
var niv = null;

// DIALLO MAMADOU 

// YOUR CODE BELOW
var Listener = function(){
	var create = document.getElementById("create");
	create.addEventListener("click",cible);
	var start = document.getElementById("start");
	start.addEventListener('click',demarre);
	start.addEventListener("click",nbrCibles);
	start.addEventListener("click",ciblesRestantes);

}
window.addEventListener("load",Listener);
//==================================================================================
var cord_alea = function(){
	/*
	Cette fonction renvoie une variable aléatoire
	*/
	return Math.floor(Math.random()*89);
}
//==================================================================================
var cible = function(){
	/*
	Cette fonction crée la boule, l'ajoute dans le terrain, change sa couleur et 
	la supprime lors d'un clique sur celle-ci.
	*/

	var terrain = document.getElementById("terrain");
	var boule = document.createElement("div");
	boule.className = "target on";
	boule.style.top = cord_alea().toString() + "%";
	boule.style.left = cord_alea().toString() + "%";
	terrain.appendChild(boule);
	//la couleur des cibles
	var boules = document.getElementsByClassName("target on");
	for (i in boules){
		if (i %2 == 0){
			boules[i].style.backgroundImage = "url(images/boule2.jpg)";
		}
    	
    }
	var lesBoules = document.getElementsByClassName("target");
	for (boul of lesBoules){
		boul.addEventListener("click",remove);
	}
}
//=============================================================================
var remove = function(){
	/*
	Cette fonction assure la suppression des boules
	*/
	var terrain = document.getElementById("terrain");
	this.className +=" hit";
	var target = this;
	window.setTimeout(function(){terrain.removeChild(target)},1000);
}
//==============================================================================
var demarre = function(){
	/*
	Cette fonction gére le bouton demarre et aussi lors de chaque 
	clique sur celui-ci l'image de l'arrière plan change aléatoirement
	*/
	var create = document.getElementById("create");
	create.removeEventListener("click",cible);
	clearInterval(chronoTimer);
	chronoTimer = setInterval(Chrono,100);
	time = 0;
	var terrain = document.getElementById("terrain");
	var lesBoulesAffichees =document.getElementsByClassName("target");
	while (lesBoulesAffichees.length > 0){
		terrain.removeChild(lesBoulesAffichees[0]);
	}
	//L'image de l'arrière plan qui change à chaque clique sur demarrer
	var tabImages = new Array(5);
		tabImages[0] = "images/body.png";
		tabImages[1] = "images/body1.jpg";
		tabImages[2] = "images/body4.jpg";
		tabImages[3] = "images/body7.png";
		tabImages[4] = "images/body11.jpg";
		tabImages[5] = "images/body9.png";
		tabImages[6] = "images/body10.jpg";
		var val = Math.floor(Math.random()*7);
		var body = document.querySelector("body");
		body.style.backgroundImage = "url("+ tabImages[val]+")";
		body.style.backgroundPosition = "center";
		body.style.backgroundAttachment = "fixed";
		body.style.beckgroundRepeat = "noRepeat";
}
//=============================================================================
var Chrono = function(){
	/*
	Cette fonction gére le chronomètre
	*/
	time++;
	var tenth = document.getElementById("tenth");
	var seconds = document.getElementById("seconds");
	var minutes = document.getElementById("minutes");
	var d = time % 10;
	var s = Math.floor(time/10) % 60;
	var m = Math.floor((Math.floor(time/10))/60);
	tenth.textContent = d;
	seconds.textContent = s;
	minutes.textContent = m
}
//==============================================================================
var nbrCibles = function(){
	/*
	Cette fonction crée le nombre de cibles contenu dans la case 
	"nombre de cibles" donc de l'ID nbtargets
	*/
	var lesBoulesAffichees =document.getElementsByClassName("target");
	var nbtargets = document.getElementById("nbtargets");
 	for (var i = 0; i < nbtargets.value; i++){
		cible();
	}
	/*if ( nbtargets.value > 20){
		for(var j of lesBoulesAffichees ){
			j.style.width = '20px';
			j.style.height = '20px';
		}
	}*/
	if (niv == "difficile"){
		for(var j of lesBoulesAffichees ){
			j.style.width = '15px';
			j.style.height = '15px';
	}
	}

}
//=============================================================================
var ciblesRestantes = function(){
	/*
	Cette fonction gére la décrementation du nombre de cibles restantes
	lors de chaque clique sur une cible
	*/
  	var lesBoulesAffichees = document.getElementsByClassName("target");
  	var remaining = document.querySelector('#remaining');
  	remaining.textContent = lesBoulesAffichees.length;
  	for (var i of lesBoulesAffichees){
  		i.addEventListener('click',nbrCiblesDecremente);
	}
}	
//=============================================================================
var nbrCiblesDecremente = function(){
	/*
	Cette fonction décremente le nombre de cibles restantes 
	et lorsque celui-ci est égale à 0 arrête le chronomètre et
	affiche une alerte  
	*/
	var start = document.getElementById("start");
	var control = document.getElementById("control");
	var remaining = document.querySelector('#remaining');
	var create = document.getElementById("create");
	var corps = document.querySelector("body");
	remaining.textContent--;
	if (remaining.textContent == 0){
		clearInterval(chronoTimer);
		var d = time % 10;
		var s = Math.floor(time/10) % 60;
		var m = Math.floor((Math.floor(time/10))/60);
		start.removeEventListener('click',demarre);
		start.removeEventListener("click",nbrCibles);
		start.removeEventListener("click",ciblesRestantes);
		var timer = window.setInterval(alerte,50);
		window.setTimeout(function(){corps.style.backgroundColor = create.style.backgroundColor = "white";terrain.style.backgroundColor = "rgba(128,255,128,0.3)";
					control.style.backgroundColor = "rgb(200,200,255)"; window.alert("gagné en:"+ m +"'"+s+'"'+d);clearInterval(timer);},5000);
		window.setTimeout(function(){
			rep = window.prompt("voulez-vous changer de niveau\n repondez par 'oui' ou 'non'");
			if (rep == "oui" || rep == "OUI"){
			niv = window.prompt("Vous diposez de deux niveaux veuillez choisir! \n 'facile' pour une taille normale des cibles \n \t\t\t\t & \n 'difficile' pour des cibles plus petites");
		}
		start.addEventListener('click',demarre);
		start.addEventListener("click",nbrCibles);
		start.addEventListener("click",ciblesRestantes);
		create.addEventListener("click",cible);},5000); 
	}
}
//==============================================================================
var arrierePlan = function(){
	/*
	Cette fonction change l'arrière plan de la page lors du chargement
	*/
	var body = document.querySelector("body");
	body.style.backgroundImage = "url(images/body12.jpg)";
	body.style.backgroundPosition = "center";
	body.style.backgroundAttachment = "fixed";
	body.style.beckgroundRepeat = "noRepeat";
}
var niveaux = function(){
	niv = window.prompt("Vous diposez de deux niveaux veuillez choisir! \n 'facile' pour une taille normale des cibles \n \t\t\t\t & \n 'difficile' pour des cibles plus petites");
}
window.addEventListener("load",arrierePlan);
window.addEventListener("load",niveaux);
//var t = 0;
var alerte = function(){
	var create = document.getElementById("create");
	var control = document.getElementById("control");
	var terrain = document.getElementById("terrain");
	var tabColor = new Array(10);
	var corps = document.querySelector("body");
	tabColor[0] = "green";
	tabColor[1] = "blue";
	tabColor[2] = "olive";
	tabColor[3] = "tomato";
	tabColor[4] = "Aqua";
	tabColor[5] = "yallow";
	tabColor[6] = "orange";
	tabColor[7] = "peru";
	tabColor[8] = "purple";
	tabColor[9] = "Black";
	tabColor[10] = "white";
	var val =  Math.floor(Math.random()*11);
	corps.style.backgroundColor = tabColor[val];
	terrain.style.backgroundColor = tabColor[val+1];
	control.style.backgroundColor = tabColor[val-1];
	create.style.backgroundColor = tabColor[val-2];
}
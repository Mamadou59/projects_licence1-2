<?php
/*Author: Diallo Mamadou et Barry Mamadou*/
//objets niveau 1

function getStatus($data){
	return $data->status;
}
function getTaille($data){
	$taille = $data->taille;
	if ($taille <20) return $taille;
	return 20;
} 
function getArgs($data){
	$tabArgs = array();
	$tabArgs["commune"] = $data->args->commune;
	$tabArgs["carburants"] = $data->args->carburants;
	$tabArgs["rayon"] = $data->args->rayon;
	return $tabArgs;
}
function getTime($data){
	return $data->time;
}
function getMessage($data){
	if ($data->status == 'error') return $data->message;
	return none;
}
function getTabData($data){
	return $data->data;
}
//objet niveau 2
function getStationId($tabData){
	return $tabData->id;
}
function getCardCoordonate($tabData){
	return array('latitude' => $tabData->latitude ,'longitude' => $tabData->longitude );
}
function getPop($tabData){
	$val = $tabData->pop;
	if ($val == "R") return "Se situe en bordure de route";
	return "Se situe à l'autoroute";
}
function getCpostal($tabData){
	return "<b>CP: </b>".$tabData->cp;
}
function getAdresse($tabData){
	$res = $tabData->adresse;
	return "<b>Adr: </b> $res"; 
}
function getAutomate24($tabData){
	if ($tabData->automate24 == 0) return "<b>Automate24: </b> Disponible";
	return "<b>Automate24: </b>Non disponible";
}
function getVille($tabData){
	$res = $tabData->ville;
	return $res;
}
function getNom($tabData){
	$name = $tabData->nom;
	if ($name != "") return $name;
	return none;
}
function getMarque($tabData){
	$marque = $tabData->marque;
	if ($marque != "") return $marque;
	return none;
}
function getTabDataPrice($tabData){
	return $tabData->prix; // c'est un tableau d'objet qui est retourné
}
function getTabDataService($tabData){
	return $tabData->services;
}
//objets niveau 3
//prix
function getIdCarburant($tabDataPrice,$i){
	return $tabDataPrice[$i]->idCarburant;
}
function getLibelleCarburant($tabDataPrice,$i){
	$res = $tabDataPrice[$i]->libelleCarburant;
	return "<b>Carbu: </b>$res";	
}
function getValue($tabDataPrice,$i){
	return $tabDataPrice[$i]->valeur;
}
function getDateMaj($tabDataPrice,$i){
	return $tabDataPrice[$i]->maj;
}
//pour obtenir un bloc section contenant d'autres à l'intérieur qui répresenteront des informations d'une station soit l'adresse, le code postatal,le nom,la marque si présente,...
function creeStationPopupHTML($data,$i){
	$data = $data->data;
	$dataStation = $data[$i];
	$coord = getCardCoordonate($dataStation);
	$stationPopUp = "<section class = 'infoStation' data-lon='".$coord["longitude"]."' data-lat='".$coord["latitude"]."' data-id='".getStationId($dataStation)."' data-ville =\"".getVille($dataStation)."\" data-adresse = \"".getAdresse($dataStation)."\"><h5>les infos</h5>\n<section class='otherInfo'>\n<h3>Des informations</h3>\n<p>".getAdresse($dataStation)."</p>\n"."<p>".getCpostal($dataStation)."</p>\n<p>".getPop($dataStation)."</p>\n<p>".getAutomate24($dataStation)."</p>\n";
	if (getMarque($dataStation) != none) $stationPopUp .= "<p> <b>Marque: </b> ".getMarque($dataStation)."</p>\n";
	if (getNom($dataStation) != none)  $stationPopUp .= "<p><b>Nom:</b> ".getNom($dataStation)."</p>\n";
	return $stationPopUp."</section>\n";
}
//Pour obtenir un bloc section contenant les prix des carburants proposés par une station.
function creeStationPriceHTML($data,$i){
	$data = $data->data;
	$stationPopUp = "<section class = 'prix'> <h5> PRIX </h5>\n";
	$dataStation = $data[$i];
	$tabPrix = getTabDataPrice($dataStation);
	$len = count($tabPrix);
	for($i=0;$i<$len;$i++) {
		$stationPopUp .= "<div>\n <p>".getLibelleCarburant($tabPrix,$i)."</p>\n<p><b>Prix: </b>"."<span>".getValue($tabPrix,$i)." € </span></p>\n<p><b>D.maj: </b> ".getDateMaj($tabPrix,$i)."</p>\n</div>\n";
	}
	$stationPopUp .= "</section>";
	return $stationPopUp;
}
//Pour obtenir un bloc section contenant les différents services proposés par une station.
function creeStationServicesHTML($data,$i){
	$dataStation = $data->data[$i];
	$tabServices = getTabDataService($dataStation);
	$len = count($tabServices);
	if ($len == 0) return none;
	$stationPopUpservices = "<section class = 'services'> <h5> SERVICES </h5>\n";
	for ($i=0;$i<$len;$i++){
		$stationPopUpservices .= "<p>".$tabServices[$i]."</p>\n";
	}
	$stationPopUpservices .= "</section>\n";
	return $stationPopUpservices;
}
// Pour obtenir un bloc div represente une requête effectuée avec des erreurs.
function getErrorHTML($data){
	$tab = getArgs($data);
	$tab["Erreur"] = getMessage($data);
	$tab["D.deRecherche"] = getTime($data);
	$allHtml = "<div id='error'>Une erreur est détectée";
	foreach ($tab as $key => $value) {
	 	$allHtml .= "<p>$key: $value</p>";
	}
	$allHtml .= "</div>";
	return $allHtml;
}
//Pour obtenir un bloc réprésenete une requête qui donne rien.
function notFound($data){
	$tab = getArgs($data);
	$allHtml = "<div id ='notFound'> Aucun resultat ne correspond à votre recherche";
	foreach ($tab as $key => $value) {
		$allHtml .= "<p>$key: $value</p>";
	}
	$allHtml .= "</div>";
	return $allHtml;
}

// Pour obtenir une section contennant toutes les informations decrites précédement.
function getStation($data){
	$allStationPopUp = "<section id = 'infoAllStation'><h5>Les stations</h5>";
	for($i=0;$i<getTaille($data);$i++){
		$allStationPopUp .= "\n<section id='".getStationId($data->data[$i])."'><h6>la $ième station</h6>\n";
		$allStationPopUp .= creeStationPopupHTML($data,$i);
		$allStationPopUp .= creeStationPriceHTML($data,$i);
		if (creeStationServicesHTML($data,$i) != none) $allStationPopUp .= creeStationServicesHTML($data,$i);
		$allStationPopUp .= "</section>\n</section>";
	}
	$allStationPopUp .= "</section>\n";
	return $allStationPopUp;
}

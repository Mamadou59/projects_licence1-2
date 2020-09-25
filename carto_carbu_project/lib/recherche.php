<?php
/* Author: Diallo Mamadou et Barry Mamadou*/
	require('verifyParams.php');
	require('fonctions.php');
	$error = false;
	if($carburant == none) {
		$errorPage = "<section id = 'error'> <p>Pensez à choisir le carburant que vous recherchez</p></section>";
		$error = true;
	}
	else{
		if($rayon == none) $data = file_get_contents("http://webtp.fil.univ-lille1.fr/~clerbout/carburant/stations.php?commune=$commune&carburants=$carburant");
		else $data = file_get_contents("http://webtp.fil.univ-lille1.fr/~clerbout/carburant/stations.php?commune=$commune&carburants=$carburant&rayon=$rayon");
		$dataPhp = json_decode($data);
		if (getStatus($dataPhp) == "error") {
		$errorPage = getErrorHTML($dataPhp);
		$error = true;
		}else if (getTaille($dataPhp) == 0) {
		$errorPage = notFound($dataPhp);
		$error = true;
		}
	}
?>
<?php
/* Author: Diallo Mamadou et Barry Mamadou*/
	const METHOD = INPUT_GET;
	function checkCommune($name){
		$res = filter_input(METHOD,$name,FILTER_UNSAFE_RAW);
		return $res;		
	}
	function checkRayon($name){
		$res = filter_input(METHOD,$name,FILTER_SANITIZE_STRING);
		if ($res === NULL || $res === '' || $res <= 0) return none;
		return $res;
	}
	function checkCarburant($name){
		$res = filter_input(METHOD,$name,FILTER_SANITIZE_STRING, ['flags'=>FILTER_REQUIRE_ARRAY]);
		if ($res === NULL) return none;
		$res = implode(',', $res);
		return $res;
	}
	$commune = checkCommune("commune");
	$rayon = checkRayon("rayon");
	$carburant = checkCarburant("carburant");


?>
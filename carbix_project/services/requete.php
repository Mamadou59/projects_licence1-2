<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

date_default_timezone_set ('Europe/Paris');

set_include_path('..');

header('Content-type: application/json; charset=UTF-8');

require_once("lib/common_service.php");

$args = new RequestParameters();
$args->defineNonEmptyString('commune');
$args->defineInt('rayon',['default'=>1,'min_range'=>1]);
$args->defineNonEmptyString('carburants',['dimension'=>'array']);

if ($args->isValid()){
    $commune = $args->commune;
    $rayon = $args->rayon;
    $carburants =  implode(',',$args->carburants); 
    $res = file_get_contents("http://webtp.fil.univ-lille1.fr/~clerbout/carburant/recherche.php?commune={$commune}&rayon={$rayon}&carburants={$carburants}");
    $res_PHP = json_decode($res);
    $taille = 20;
    if ($res_PHP->status == "ok"){
        if ($res_PHP->taille < 20) $taille = $res_PHP->taille;
        produceResult(array($res_PHP->data,'taille'=>$taille));
    }
    else
        produceError($res_PHP->message); 
}   
else
    produceError('argument(s) invalide(s) --> '.implode(' ',$args->getErrorMessages()) );
?>
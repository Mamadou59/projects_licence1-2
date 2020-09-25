<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

date_default_timezone_set ('Europe/Paris');

set_include_path('..');

header('Content-type: application/json; charset=UTF-8');

require_once("lib/common_service.php");
require_once('lib/session_start.php');

$args = new RequestParameters();
$args->defineNonEmptyString("id");
$args->defineInt("global",['min_range'=>0,'max_range'=>5]);
$args->defineInt("accueil",['min_range'=>0,'max_range'=>5]);
$args->defineInt("prix",['min_range'=>0,'max_range'=>5]);
$args->defineInt("service",['min_range'=>0,'max_range'=>5]);
if ($args->isValid()){
    if (isset($_SESSION["ident"]))
        try{
            $data = new DataLayer();
            $res = $data->noteStation($_SESSION['ident']->pseudo,$args->id,$args->global,$args->accueil,$args->prix,$args->service);
            if ($res)
                produceResult($res);
            else
                produceError("La station {$args->id} n'existe pas!");
        } catch (PDOException $e){
            produceError($e->getMessage());
        }
    else produceError("Vous n'êtes pas connecté!");
}   
else
    produceError('argument(s) invalide(s) --> '. implode(' ',$args->getErrorMessages()) );
?>
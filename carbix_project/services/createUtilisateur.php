<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

date_default_timezone_set ('Europe/Paris');

set_include_path('..');

header('Content-type: application/json; charset=UTF-8');

require_once("lib/common_service.php");

$args = new RequestParameters();
$args->defineNonEmptyString('pseudo');
$args->defineNonEmptyString('password');

if ($args->isValid()){
    if (isset($_SESSION["ident"])){
        produceError("Vous êtes déjà connecté!");
        return;
    }
    $data = new DataLayer();
    $res = $data->createUser($args->pseudo,$args->password);
    if ($res){
        produceResult(["pseudo"=>$args->pseudo]);
    }
    else
        produceError("Ce pseudo ($args->pseudo) existe déjà!"); 
}   
else
    produceError('argument(s) invalide(s) --> '.implode(' ',$args->getErrorMessages()) );
?>
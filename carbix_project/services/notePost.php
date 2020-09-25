<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

date_default_timezone_set ('Europe/Paris');

set_include_path('..');

header('Content-type: application/json; charset=UTF-8');

require_once("lib/common_service.php");
require_once('lib/session_start.php');

$args = new RequestParameters();

$args->defineNonEmptyString("id");
$args->defineNonEmptyString("avis");

if ($args->isValid()){
    if (isset($_SESSION["ident"]))
        try{
            $data = new DataLayer();
            $res = $data->notePost($_SESSION["ident"]->pseudo,$args->id,$args->avis);
            if ($res)
                produceResult($res);
            else
                produceError("Vous ne pouvez pas noter vos propres posts!");
        } catch (PDOException $e){
            produceError($e->getMessage());
        }
    else produceError("Connectez-vous pour noter un post!");
}   
else
    produceError('argument(s) invalide(s) --> '. implode(' ',$args->getErrorMessages()) );
?>
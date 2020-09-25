<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

date_default_timezone_set ('Europe/Paris');

set_include_path('..');

header('Content-type: application/json; charset=UTF-8');

require_once("lib/common_service.php");
require_once('lib/session_start.php');

$args = new RequestParameters();
$args->defineNonEmptyString('station');
$args->defineNonEmptyString('titre');
$args->defineNonEmptyString('contenu');
if ($args->isValid())
    if (isset($_SESSION["ident"])){
        try{
            $data = new DataLayer();
            $res = $data->createPost($_SESSION['ident']->pseudo,$args->station,$args->titre,$args->contenu,date('d/m/Y H:i:s'));
            if ($res)
                produceResult($res);
            else
                produceError("not foud!"); 

        } catch (PDOException $e){
            produceError($e->getMessage());
        }  
    }
    else
        produceError("Vous n'êtes pas connecté!");
     
else
    produceError( implode(' ',$args->getErrorMessages()) );
?>
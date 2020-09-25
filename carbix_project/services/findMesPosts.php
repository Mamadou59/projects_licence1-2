<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

date_default_timezone_set ('Europe/Paris');

set_include_path('..');

header('Content-type: application/json; charset=UTF-8');

require_once("lib/common_service.php");
require_once('lib/session_start.php');


//$_SESSION["ident"] = true;
//ces deux ligne sont à remplacer par le contenu de $_SESSION["ident"]
$args = new RequestParameters();
$args->defineNonEmptyString("pseudo");
if ($args->isValid()){
    if (isset($_SESSION["ident"]))
        try{
            $data = new DataLayer();
            $mesPosts = $data->getMyPost($args->pseudo);//A remplacer par $_SESSION["ident"]->pseudo
            if ($mesPosts){
                 produceResult(["liste"=>$mesPosts,"date"=>date('d/m/Y H:i:s')]);
            }
            else
               produceError("{$args->pseudo} vous n'avez aucun post!");
     
      
        } catch (PDOException $e){
            produceError($e->getMessage());
        }
    else produceError("Vous n'êtes pas connecté!");
}   
else
    produceError( implode(' ',$args->getErrorMessages()) );
?>
<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

date_default_timezone_set ('Europe/Paris');

set_include_path('..');

header('Content-type: application/json; charset=UTF-8');

require_once("lib/common_service.php");
require_once('lib/session_start.php');


if(isset($_SESSION["ident"])){

    $args = new RequestParameters('post');
    $args->defineString("mail");
    $args->defineString("ville");
    $args->defineString("password");
    $args->defineString("description");
    if ($args->isValid()){
        try{
            $data = new DataLayer();
            $userInfo = $data->updateProfil($_SESSION["ident"]->pseudo,$args->mail,$args->description,$args->ville,$args->password);
            if ($userInfo){
                $identite = new Identite($userInfo["pseudo"],$userInfo["mail"],$userInfo["ville"],$userInfo["description"],$userInfo["nbavis"],$userInfo["total"],$userInfo["nbposts"],$userInfo["nblike"],$userInfo["nbnolike"]);
                produceResult($identite);
            }
            else
                produceError("Aucune modification n'a été prise en compte!!"); 
        }catch (PDOException $e){
            produceError($e->getMessage());
        }   
    } else
        produceError('argument(s) invalide(s) --> '.implode(' ',$args->getErrorMessages()));
} else
    produceError("Vous devez vous connectez!!");
?>
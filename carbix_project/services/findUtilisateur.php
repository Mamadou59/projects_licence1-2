<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

date_default_timezone_set ('Europe/Paris');

set_include_path('..');

require_once("lib/common_service.php");

$args = new RequestParameters();
$args->defineNonEmptyString('pseudo');
if ($args->isValid())
    try{
        $data = new DataLayer();
        $userInfo = $data->getUser($args->pseudo);
        if ($userInfo){
            $identite = new Identite($userInfo["pseudo"],$userInfo["mail"],$userInfo["ville"],$userInfo["description"],$userInfo["nbavis"],$userInfo["total"],$userInfo["nbposts"],$userInfo["nblike"],$userInfo["nbnolike"]);
            produceResult($identite);
        }
        else
           produceError("user {$args->pseudo} not found!");
 
  
    } catch (PDOException $e){
        produceError($e->getMessage());
    }   
else
    produceError( implode(' ',$args->getErrorMessages()) );
?>

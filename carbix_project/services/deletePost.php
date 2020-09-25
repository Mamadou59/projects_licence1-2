<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

date_default_timezone_set ('Europe/Paris');

set_include_path('..');

header('Content-type: application/json; charset=UTF-8');

require_once("lib/common_service.php");
require_once('lib/session_start.php');

$args = new RequestParameters();
$args->defineInt('id');

if ($args->isValid())
    if (isset($_SESSION['ident'])){
        try{
        $data = new DataLayer();
        $res = $data->deletePost($_SESSION["ident"]->pseudo,$args->id);
        if ($res){
            produceResult($res);
        }
        else
            produceError("Post {$args->id} non trouvé!"); 

        } catch (PDOException $e){
            produceError($e->getMessage());
        }   
    } else
        produceError("Vous n'êtes pas connecté!");
    
else
    produceError('argument(s) invalide(s) --> '.implode(' ',$args->getErrorMessages()) );
?>
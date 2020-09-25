<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

date_default_timezone_set ('Europe/Paris');

set_include_path('..');

header('Content-type: application/json; charset=UTF-8');

require_once("lib/common_service.php");

$args = new RequestParameters();
if ($args->isValid())
    try{
        $data = new DataLayer();
        $bestStations = $data->getBestStations();
        if ($bestStations){
            produceResult($bestStations);
        }
        else
           produceError("Stations not foud!");
 
  
    } catch (PDOException $e){
        produceError($e->getMessage());
    }   
else
    produceError( implode(' ',$args->getErrorMessages()) );
?>
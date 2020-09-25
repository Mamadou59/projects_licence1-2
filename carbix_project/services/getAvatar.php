<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

set_include_path('..'.PATH_SEPARATOR);
require_once('lib/common_service.php');


$args = new RequestParameters();
$args->defineNonEmptyString('pseudo');

//$args->defineNonEmptyString('size');

if (! $args->isValid()){
  produceError('argument(s) invalide(s) --> '.implode(', ',$args->getErrorMessages()));
  return;
}

try{
  $data = new DataLayer();
  $descFile = $data->getAvatar($args->pseudo);
  if ($descFile){ // l'utilisateur existe
    // si l'avatar est NULL, renvoyer l'avatar par défaut :
    $flux = is_null($descFile['data']) ? fopen('../images/avatar1.png','r') : $descFile['data'];
    $mimeType = is_null($descFile['data']) ? 'image/png' : $descFile['mimetype'];
    
    header("Content-type: $mimeType");
    fpassthru($flux);
    exit();
  }
  else
    produceError('Utilisateur inexistant');
}
catch (PDOException $e){
  produceError($e->getMessage());
}

?>
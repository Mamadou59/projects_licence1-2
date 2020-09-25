<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

set_include_path('..'.PATH_SEPARATOR);

require_once('lib/common_service.php');
require_once('lib/session_start.php');


if ( ! isset($_SESSION['ident'])) {
  
  $args = new RequestParameters("post");
  $args->defineNonEmptyString('login');
  $args->defineNonEmptyString('password');

  if (! $args->isValid()){
   produceError('argument(s) invalide(s) --> '.implode(', ',$args->getErrorMessages()));
   return;
  }
  $data = new DataLayer();
  $personne = $data->authentifier($args->login,$args->password);
  if ($personne){
    $_SESSION["ident"] = $personne;
    produceResult($personne);
  } else{
    produceError("Le login ou le password est incorrecte!");
  }
} else {
   produceError("déjà authentifié");
   return;
}
?>

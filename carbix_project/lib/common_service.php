<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

 date_default_timezone_set ('Europe/Paris');
 header('Content-type: application/json; charset=UTF-8');

 spl_autoload_register(function ($className) {
    include ("lib/{$className}.class.php");
 });

 
 function answer($reponse){
  global $args; 
  if (is_null($args))
    $reponse['args'] = [];
  else {
    $reponse['args'] = $args->getValues();
    unset($reponse['args']['password']);
  }
  $reponse['time'] = date('d/m/Y H:i:s');
  echo json_encode($reponse);
 }

 function produceError($message){
    answer(['status'=>'error','message'=>$message]);
 }
 function produceResult($result){
    answer(['status'=>'ok','result'=>$result]);
 }


 /**
 * $result => le resultat à prduire 
 * $listArgs => la liste des arguments.
 */
 function answer1($reponse,$listArgs){
  global $args; 
  foreach ($listArgs as $key => $value) {
    $reponse['args'][$key] = $value;
  }
  unset($reponse['args']['tmp_name']);
  $reponse['time'] = date('d/m/Y H:i:s');
  echo json_encode($reponse);
 }

 /**
 * Pour l'avatar cette fonction fonction permettra d'obtenir les arguments de $_FILE['image'];
 * $result => le resultat à prduire 
 * $listArgs => la liste des arguments.
 */
 function produceResultAvatar($result,$listArgs){
    answer1(['status'=>'ok','result'=>$result],$listArgs);
 }

?>

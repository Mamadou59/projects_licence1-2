<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

date_default_timezone_set ('Europe/Paris');

set_include_path('..');

 header('Content-type:application/json');
	require_once("lib/common_service.php");
	require_once('lib/session_start.php');
	require_once('lib/utilImages.php');//Pour le redimentionnement d'image.

$args = new RequestParameters();


if (isset($_SESSION['ident'])){
	if (isset($_FILES["image"]) && $_FILES["image"]["tmp_name"] != ""){

		$image = $_FILES["image"];
    	$flux = fopen($image["tmp_name"],"r");
    	$type = $image["type"];
    	$imageSpec = array('data' =>$flux , "mimetype" => $type );
		$pseudo = $_SESSION["ident"]->pseudo;
		$data = new DataLayer();
		$res = $data->storeAvatar($imageSpec, $pseudo);

  //   	$image = $_FILES["image"];
  //   	$flux = fopen($image["tmp_name"],"r");
		// $image = createImageFromStream($flux);                   // créer l'image source
		// $largeur = imagesx($image);
		// $hauteur = imagesy($image);
		// $min = min($largeur,$hauteur);
		// $imageReduite = imagecreatetruecolor($largeur/2,$hauteur/2);
		// imagecopyresampled($imageReduite, $image, 0, 0, ($largeur-$min)/2, ($hauteur-$min)/2, 256, 256, $min, $min);
		
		// $fluxTmp = fopen("php://temp", "r+");// créer un flux de stockage temporaire
		// imagejpeg($imageReduite, $fluxTmp); // écrire dans le flux
		// rewind($fluxTmp); // préparer le flux à la lecture
		// $data = new DataLayer();
		// $pseudo = $_SESSION["ident"]->pseudo;
		// $imageSpec = array('data' =>$fluxTmp , "mimetype" => $image["type"] );
		// $res = $data->storeAvatar($imageSpec, $pseudo); // utiliser le flux
		//var_dump($_FILES['image']);
		
		if ($res){
			produceResultAvatar(true,$_FILES['image']);
		}
		else
			produceError("L'image ne peut-etre ajoutee!");
  	}
  	else 
  		produceError("L'image non reçue!");
}
else
	produceError("Connectez-vous!");
?>

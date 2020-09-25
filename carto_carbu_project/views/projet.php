<!DOCTYPE html>
<!-- Author: Diallo Mamadou et Barry Mamadou-->
<html xmlns="http://www.w3.org/1999/xhtml">
   <head>
      <meta charset="UTF-8" />
      <script type="text/javascript" src="js/scriptCard.js"></script>
      <title> Page </title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css"
   	integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
   crossorigin=""/>
	<script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js"
   integrity="sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg=="
   crossorigin=""></script>
   <link rel="stylesheet" type="text/css" href="css/carte.css">
   <link rel="stylesheet" type="text/css" href="css/page.css">
   </head>
   <body>
      <header> <h1>Carto’Carbu</h1></header>
   		<?php
         $acceuil = "<div id ='acceuil'> <p> Vous manquez de carburant dans les Hauts de France ou que vous voulez prendre un peu d'aire avant de continuer votre trajet? faites votre recherche ici et votre problème sera resolu!!</p></div>";
   		require ("lib/recherche.php");
         require("views/formulaire.php");
         echo '<section>';
         echo $acceuil;
         echo '<div id="carte"> </div>';
         echo '<div id= "info"></div>';
         print_r(creeFormulaire());
         echo "</section>";
         if ($error) echo($errorPage);
         else print_r(getStation($dataPhp));
		?>
   </body>
</html>

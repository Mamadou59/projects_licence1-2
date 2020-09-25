<?php
spl_autoload_register(function ($className) {
    include ("lib/{$className}.class.php");
});

require('lib/session_start.php');
if (isset($_SESSION['ident'])){
    $personne = $_SESSION['ident'];
}
date_default_timezone_set ('Europe/Paris');
require('views/pagePrincipale.php');

?>

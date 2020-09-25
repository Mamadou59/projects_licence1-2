<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

  $dataPersonne ="";

  if (isset($personne)) // l'utilisateur est authentifié
    $dataPersonne = "data-personne='".htmlentities(json_encode(["pseudo"=>$personne->pseudo]))."'"; // l'attribut data-personne contiendra le pseudo de l'utilisateur, en JSON
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Carbadvisor</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css"
    integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
   crossorigin=""/>
  <script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js"
   integrity="sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg=="
   crossorigin=""></script>
  <link rel="stylesheet" href="style/styleAccueil.css" />
  <link rel="stylesheet" type="text/css" href="style/styleRecherche.css" />
  <link rel="stylesheet" type="text/css" href="style/carte.css">
  <link rel="stylesheet" type="text/css" href="style/styleProfil.css">
  <link rel="stylesheet" type="text/css" href="style/stylePosts.css">
  <script src="js/fetchUtils.js"></script>
  <script src="js/action_accueil.js"></script>
  <script src="js/gestion_log.js"></script>
  <script src="js/gestion_pageRecherche.js"></script>
  <script src="js/gestion_profil.js"></script>
  <script src="js/gestion_posts.js"></script>
</head>

<?php
  echo "<body $dataPersonne>";
?>
  <button class ="creationCompte deconnecte" >Créer un compte</button>
  <button id='nuit'>Mode nuit</button>
  <button id='jour'>Mode jour</button>
  <h1> Carbadvisor </h1>
  <header id = "navEntete">
    <nav id = "navPrincipal">
      <button id="pageAccueil">Page d'accueil</button>
      <button id = "pageRecherche">Page de recherche</button>
      <button id = "pageGestionProfil" class="connecte"> Mon profil</button>
      <button id = "pageGestionPost" class="connecte">Mes posts</button>
      <button id = "connexion" class="deconnecte">Connexion</button>
      <button id = "logout" class = "connecte">Deconnexion</button>
    </nav>
  </header>
  <section id = "contenue">
    <h6 hidden="">3</h6>
    <section id = "accueil">
      <h6 hidden="">4</h6>
    </section>
    <?php
    require_once("views/pageLoginRegister.php");
    ?>
    <div id = "profil"> 
      <img id="avatar" alt="mon avatar" src="..." /><br>
      <button id = 'uploadAvatar'>Chager d'avatar</button>
      <div id="user"></div>
      <div id = "infoUser"></div>
    </div>
    <?php
      require_once("views/pageFormUpdateProfil.php");
    ?>
    <form id="upload_image" action="services/uploadAvatar.php" method = "post" enctype="multipart/form-data">
     <fieldset>
        <legend>Nouvel avatar</legend>
        <input type="file" name="image" required="required"/>
        <button type="submit" name="valid" value="envoyer">Envoyer</button><br>
        <output for ='image' name='message'></output>
      </fieldset>
    </form>
    <div id = "blocPost">
    <scroll-container id = "mesPosts">
      
    </scroll-container>
  </div>
      <div id = "formRecherche" class = "recherche afterSubmit">
        <?php
          require_once("views/pageFormRecherche.php");
        ?>
      </div>
      <div id = "carbixCarte" class = "recherche afterSubmit"></div>
      <div id = "infoStation" class = "recherche afterClickButton">
      </div>
      <div id = "vosPosts" class = "recherche afterClickButton">
      <h4><strong>&darr;</strong> Les posts <strong id=poster> <a href="." title="poster">&lt; Je poste! </a></strong></h4>
      <scroll-container ></scroll-container>
      </div>
      <div id = "notePostStation" class = "recherche afterClickButton">
        <div id = "vosAvis" class = "recherche afterClickButton">
          <h4><strong>&darr;</strong> Vos avis</h4>
          <p id = 'global' class="notes"></p>
          <p id='noteAccueil'><strong>Accueil =&gt; </strong> <span>&#927;</span><span>&#927;</span><span>&#927;</span><span>&#927;</span><span>&#927;</span> <em class = 'notes'></em> </p>
          <p id='noteServices'><strong>Services =&gt; </strong> <span>&#927;</span><span>&#927;</span><span>&#927;</span><span>&#927;</span><span>&#927;</span> <em class = 'notes'></em> <strong id ='donneAvis'><a href="." title="noter">  &lt; Je donne mon avis!</a></strong></p>
          <p id='notePrix'><strong>Prix  =&gt;</strong> <span>&#927;</span><span>&#927;</span><span>&#927;</span><span>&#927;</span><span>&#927;</span> <em class = 'notes'></em></p>
        </div>
        <div id = 'formNoteEtPost' class = "recherche">
          <form action="services/noteStation.php" method="POST" id = "form_noteStation" class="noterPoster">
          <fieldset>
            <input type='number' name='global' placeholder='N global* (0-5)' step = "1"/><br>
            <input type='number' name='accueil' placeholder='N accueil* (0-5)' step = "1"/><br>
            <input type='number' name='service' placeholder='N Service* (0-5)' step = "1"/><br>
            <input type='number' name='prix' placeholder='N prix* (0-5)' step = "1"/><br>
            <button type="submit" name="valid">Noter</button><br/>
            <output for='global accueil service prix' name = 'message'></output>
          </fieldset>
          
          </form>
          <form action="services/createPost.php" method="POST" id = "form_poste" class="noterPoster">
            <fieldset>
            <input type='text' name='titre' placeholder='Titre*'/><br>
            <label for="contenu"><strong>&darr;</strong> Le contenu de votre post*</label><br/>
            <textarea id = 'contenu' name="contenu" cols="40" rows="5" maxlength="500"></textarea>
            <button type="submit" name="valid">Poster</button><br/>
            <output for='titre contenu' name = 'message'></output>
            </fieldset>
          </form>
        </div>
      </div>
  </section>
 </body>

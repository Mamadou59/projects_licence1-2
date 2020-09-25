<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

require_once("lib/db_parms.php");
   
Class DataLayer{
    private $connexion;
    public function __construct(){

            $this->connexion = new PDO(
                       DB_DSN, DB_USER, DB_PASSWORD,
                       [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                       ]
                     );

    }
    
    /*
    * Récupère les informations d'un utilisateur
    * résultat : liste (table) dont les clés associatives sont 
    * (pseudo,mail,ville,description,nbavis,total,nbposts,nblike,nbnolike)
    */
    function getUser($pseudo){
        $sql = <<<EOD
        SELECT 
        pseudo,mail,ville,description,nbavis,total,nbposts,nblike,nbnolike
        FROM carbix_users 
        WHERE pseudo = :pseudo;
EOD;
        $stmt = $this->connexion->prepare($sql);
        $stmt->bindValue(":pseudo",$pseudo);
        $stmt->execute();
        return $stmt->fetch();
    }
    /*
    * Récupère une table d'au plus 10 stations les plus notées 
    * resultat : une table dont élément est une table associative (clés 'id','marque',nom,
    * 'latitude','longitude','adresse','ville','cp','nbnotes','noteglobale','noteaccueil',
    *  'noteprix','noteservice').
    */
    function getBestStations(){
        $sql = <<<EOD
        SELECT
          id,marque,nom,latitude,longitude,adresse,ville,cp,nbnotes,
          CAST(noteglobale/cast(nbnotes as float) as decimal(3,1)) as noteglobale,
          CAST(noteaccueil/cast(nbnotes as float) as decimal(3,1)) as noteaccueil,
          CAST(noteprix/cast(nbnotes as float) as decimal(3,1)) as noteprix,
          CAST(noteservice/cast(nbnotes as float) as decimal(3,1)) as noteservice
        FROM stationsp2 
        WHERE nbnotes > '0'
        ORDER by noteglobale desc
        LIMIT 10;
EOD;
        $stmt = $this->connexion->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
    * Une fonction auxiliaire qui recupère les infos d'une station à partir d'une requête qui ne 
    * donne pas la moyenne des note.
    * $idStation => l'identifiant d'une station.
    * resultat : une table associative des (clés 'id','marque',nom,
    * 'latitude','longitude','adresse','ville','cp','nbnotes','noteglobale','noteaccueil',
    *  'noteprix','noteservice').
    */
    function getStationAux($idStation){
      $sql = <<<EOD
      SELECT * from stationsp2
      WHERE id = :idStation;
EOD;
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(':idStation',$idStation);
      $stmt->execute();
      return $stmt->fetch();
    }
    /*
    * Recupère une table contenant les info d'une station dont l'id est passé en paramètre
    * paramètre : idStation l'identifiant de la station.
    * resultat : une table associative des (clés 'id','marque',nom,
    * 'latitude','longitude','adresse','ville','cp','nbnotes','noteglobale','noteaccueil',
    *  'noteprix','noteservice').
    * NB: les notes sont les moyennes.
    */
    function getStation($idStation){
        //Pour éviter une division par 0 on s'assure d'abord par la methode précedente que la station à été notée au moins une fois par la méthode precedente.
        $res = $this->getStationAux($idStation);
        if ($res && $res['nbnotes'] == 0){
          return $res;
        }
        $sql = <<<EOD
        SELECT
          id,marque,nom,latitude,longitude,adresse,ville,cp,nbnotes,
          CAST(noteglobale/cast(nbnotes as float) as decimal(3,1)) as noteglobale,
          CAST(noteaccueil/cast(nbnotes as float) as decimal(3,1)) as noteaccueil,
          CAST(noteprix/cast(nbnotes as float) as decimal(3,1)) as noteprix,
          CAST(noteservice/cast(nbnotes as float) as decimal(3,1)) as noteservice
        FROM stationsp2 
        WHERE id = :id;
EOD;
        $stmt = $this->connexion->prepare($sql);
        $stmt->bindValue(':id',$idStation);
        $stmt->execute();
        return $stmt->fetch();
    }

    /*
    * Recupère une table contenant les posts d'une station dont l'id est passé en paramètre
    * paramètre : idStation l'id de la station.
    * resultat : une table dont chaque élément est une table associative (clés 
    * 'id','auteur','station','auteur','nblike','nbnolike').
    */
    function getPosts($idStation){
        $sql = <<<EOD
        SELECT * 
        FROM carbix_posts 
        WHERE station = :idStation
        ORDER by datecreation desc;
EOD;
        $stmt = $this->connexion->prepare($sql);
        $stmt->bindValue(':idStation',$idStation);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /*
    * Récupère une table contenant les posts d'un utilisateur.
    * paramètre : auteur => pseudo d'un utilisateur.
    * resultat : une table donc chaque élément est une table associative (clés 
    * 'id','auteur','station','auteur','nblike','nbnolike').
    */
    function getMyPost($auteur){
      $sql = <<<EOD
      SELECT * 
      FROM carbix_posts 
      WHERE auteur =:auteur
      ORDER by datecreation desc;
EOD;
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(':auteur',$auteur);
      $stmt->execute();
      return $stmt->fetchAll();
    }

    /*
    * Met à jour dans la table carbix_users les info de l'utilisateur après  
    * qu'il note une station.
    * paramètres : pseudo => pseudo de l'utilisateur 
    *              global => la note globale qu'il à donné.
    * resultat : true ou false selon que la modification est faite ou pas.
    */
    function updateNbAvisNbTotaleUser($pseudo,$global){
      $sql = <<<EOD
      UPDATE carbix_users
      SET nbavis = nbavis+1,total=total+:global
      WHERE pseudo = :pseudo;
EOD;
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(':pseudo',$pseudo);
      $stmt->bindValue(':global',$global);
      $stmt->execute();
      return $stmt->rowCount() == 1;
    }

    /*
    * Remet à jours la table stationp2 d'une station dont l'id est passé en paramètre
    * après qu' un utilisateur note la station.
    * resltat: une table associative des (clés 'id','marque',nom,
    * 'latitude','longitude','adresse','ville','cp','nbnotes','noteglobale','noteaccueil',
    *  'noteprix','noteservice') ou false si la modification n'est pas faite.
    */
    function noteStation($pseudo,$idStation,$global,$accueil,$prix,$service){
      $sql = <<<EOD
      UPDATE stationsp2
      SET nbnotes=nbnotes+1,noteglobale= noteglobale+:global,noteaccueil=noteaccueil+:accueil,noteprix=noteprix+:prix,noteservice=noteservice+:service
      WHERE id=:idStation 
EOD;
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(':idStation',$idStation);
      $stmt->bindValue(':global',$global);
      $stmt->bindValue(':accueil',$accueil);
      $stmt->bindValue(':prix',$prix);
      $stmt->bindValue(':service',$service);
      try{
        $stmt->execute();
        if ($stmt->rowCount() == 1){
          $this->updateNbAvisNbTotaleUser($pseudo,$global);
          $res = $this->getStation($idStation);
          return $res;
        }
        return FALSE;
      }catch(PDOException $e){
        return FALSE;
      }
    }

    /*
    * Incremente nblike ou nbnolike d'un utilisateur lorsqu'il note un post
    * paramètre : pseudo => pseudo de l'utilisateur et avis => 'like' ou 'nolike'
    * resultat : true ou false selon que la modification à été faite.
    */
    function updateInfoUserAfterNotePost($pseudo,$avis){
      $sql = <<<EOD
      UPDATE carbix_users
      SET nblike = nblike+1
      WHERE pseudo =:pseudo;
EOD;
      if ($avis == "nolike"){
        $sql = <<<EOD
        UPDATE carbix_users
        SET nbnolike = nbnolike+1
        WHERE pseudo =:pseudo;
EOD;
      }
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(":pseudo",$pseudo);
      try{
        $stmt->execute();
        return $stmt->rowCount() == 1;
      }catch(PDOException $e){
        return FALSE;
      }
    }

    /*
    * Recupère un post à partir de son id passé en paramètre
    * resultat : une table associative des (clés 
    * 'id','auteur','station','auteur','nblike','nbnolike').
    */
    function getPostByHisId($idPost){
      $sql = <<<EOD
      SELECT *
      FROM carbix_posts
      WHERE id=:idPost;
EOD;
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(':idPost',$idPost);
      $stmt->execute();
      return $stmt->fetch();
    }

    /*
    * Note un post 
    * paramètes : pseudo => pseudo de l'utilisateur, idPost => l'identifiant d post
    *             avis => 'like' ou 'nolike'.
    * resultat : une table associative des (clés 
    * 'id','auteur','station','auteur','nblike','nbnolike').
    */
    function notePost($pseudo,$idPost,$avis){
      $sql = <<<EOD
      UPDATE carbix_posts
      SET nblike = nblike+1
      WHERE id =:idPost and auteur != :pseudo;
EOD;
      if ($avis == "nolike"){
        $sql = <<<EOD
        UPDATE carbix_posts
        SET nbnolike = nbnolike+1
        WHERE id =:idPost and auteur != :pseudo;
EOD;
      }
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(":idPost",$idPost);
      $stmt->bindValue(":pseudo",$pseudo);
      try{
        $stmt->execute();
        if($stmt->rowCount() == 1){
          if ($this->updateInfoUserAfterNotePost($pseudo,$avis))
            return $this->getPostByHisId($idPost);
        }
        return FALSE;
      }catch(PDOException $e){
        return FALSE;
      }
    }
    /* 
    * Met à jours le nbposts d'un utilisateur qui vient de laisser un post pour une station
    * parametre : auteur => pseudo de l'utilisateur.
    * result : true ou false selon que la modification est faite ou pas.
    */
    function updateNbPostAuteur($auteur){
      $sql = <<<EOD
      UPDATE carbix_users
      SET nbposts=nbposts+1
      WHERE pseudo=:auteur;
EOD;
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(':auteur',$auteur);
      try{
        $stmt->execute();
        return $stmt->rowCount() == 1;
      }catch(PDOException $e){
        return FALSE;
      }

    }

    /*
    * Recupère un post à partir du pseudo de l'utilisateur passé en paramètre
    * resultat : une table associative des (clés 
    * 'id','auteur','station','auteur','nblike','nbnolike').
    */
    function getIdPostAfterCreation($auteur){
      $sql = <<<EOD
      SELECT id from carbix_posts
      WHERE auteur=:auteur order by id desc
      LIMIT 1;
EOD;
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(':auteur',$auteur);
      $stmt->execute();
      return $stmt->fetch();
    }

    /*
    * Crée un post 
    * paramètre : auteur => pseudo de l'utilisateur, idStation => l'id de la station,
    * titre => le titre du post, contenue => le contenu du post, 
    * datecreation => la date de création du post.
    * resultat : une table associative des (clés 
    * 'id','auteur','station','auteur','nblike','nbnolike') ou false.
    */
    function createPost($auteur,$idStation,$titre,$contenue,$datecreation){
      $sql =<<<EOD
      INSERT INTO carbix_posts
      (auteur,station,titre,contenue,datecreation)
      values(:auteur,:idStation,:titre,:contenue,:datecreation);
EOD;
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(':auteur',$auteur);
      $stmt->bindValue(':idStation',$idStation);
      $stmt->bindValue(':titre',$titre);
      $stmt->bindValue(':contenue',$contenue);
      $stmt->bindValue(':datecreation',$datecreation);
      $stmt->execute();
      if ($stmt->rowCount() == 1){
        if ($this->updateNbPostAuteur($auteur)) 
          return $this->getIdPostAfterCreation($auteur);
        else
          return FALSE;
      }
      return FALSE;    
    }
    
    /*
    * met à jours le nombre de post d'un utilisateur apères qu'il supprime l'un 
    * de ses posts.
    */
    function updateNbPostsAuteurWhenOneOfHisPostDeleted($auteur){
      $sql = <<<EOD
      UPDATE carbix_users
      SET nbposts = nbposts-1
      WHERE pseudo=:auteur;
EOD;
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(':auteur',$auteur);
      $stmt->execute();
      return $stmt->rowCount() == 1;
    }

    /*
    * supprime un post dont l'id est passé en paramètre d'un utilisateur dont 
    * le pseudo est passé en paramètre.
    * resultat : l'id du post supprimé ou false si la suppression à echouée.
    */
    function deletePost($auteur,$idPost){
      $sql =<<<EOD
      DELETE 
      FROM carbix_posts
      WHERE id =:idPost;
EOD;
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(':idPost',$idPost);
      $stmt->execute();
      if ($stmt->rowCount() == 1){
        $res = $this->updateNbPostsAuteurWhenOneOfHisPostDeleted($auteur);
        if ($res)
          return $idPost;
        return FALSE;
      }
      return FALSE;
    }

    /*
    * Test d'authentification
    * $pseudo, $password : authentifiants
    * résultat :
    *    Instance de Personne représentant l'utilsateur authentifié, en cas de succès
    *    NULL en cas d'échec
    */
    function authentifier($login,$password){
       $sql = <<<EOD
       SELECT pseudo,password,mail,ville,description,nbavis,total,nbposts,nblike,nbnolike 
       FROM carbix_users 
       WHERE pseudo =:login;
EOD;
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(':login',$login);
      $stmt->execute();
      $res = $stmt->fetch();
      if ($res === FALSE) return NULL;
      $estCorrectPWD = (crypt($password, $res["password"]) == $res['password']);
      if ($estCorrectPWD){
        $identite = new Identite($res["pseudo"],$res["mail"],$res["ville"],$res["description"],$res["nbavis"],$res["total"],$res["nbposts"],$res["nblike"],$res["nbnolike"]);
        return $identite;
      }return FALSE;
    }
    /*
    * Après la creation d'un profil cette méthode rajoute le pseudo de l'utilisateur dans
    * la table des avatars avec un avatar NULL et le mimtype.
    * $pseudo le pseudo de l'utilisateur qui vient de créer un compte.
    * return true ou false selon que tout est bien passé ou pas.
    */
    function mettreDansLaTableDesAvatarLutilisateur($pseudo){
      $sql = <<<EOD
      INSERT INTO carbix_avatar
      (pseudo) values(:pseudo);
EOD;
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(':pseudo',$pseudo);
      $stmt->execute();
      return $stmt->rowCount() == 1;
    }
    /*
    * Crée un nouveau utilisateur dans la base, à partir d'un mot
    * de ses informations (pseudo,password).
    * paramères : (pseudo,password).
    * resultat : TRUE si le compte à bien été crée et FALSE sinon
    * (dans le cas où un même login exite déjà dans la base).
    * note: le password est crypté avant l'ajout.
    */
    function createUser($pseudo,$password){
      $sql =<<<EOD
      INSERT INTO carbix_users 
      values (:pseudo,:password)
EOD;
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(':pseudo',$pseudo);
      $stmt->bindValue(':password',$password);
      $cryptPassword = password_hash($password,CRYPT_BLOWFISH);
      $stmt->bindValue(':password',$cryptPassword);
      try{
        $stmt->execute();
        $this->mettreDansLaTableDesAvatarLutilisateur($pseudo);
        return TRUE;
      }catch(PDOException $e){
        return FALSE;
      }
    }

    /*
    * Modifie dans la base de donées le profil de l'utilisateur
    * paramètres : (pseudo,mail,descrption,ville,password).
    * resultat : une table associative des (clés 
    * 'pseudo','mail','descrption','ville','password').
    */
    function updateProfil($pseudo,$mail,$description,$ville,$password){
      $userInit = $this->getUser($pseudo);
      $sql = <<<EOD
        UPDATE carbix_users 
        SET mail=:mail,description=:description,ville=:ville
        WHERE pseudo =:pseudo;
EOD;
      if ($password !== ''){
        $sql = <<<EOD
        UPDATE carbix_users 
        SET mail=:mail,description=:description,ville=:ville,password=:password
        WHERE pseudo =:pseudo;
EOD;

      $cryptPassword = password_hash($password,CRYPT_BLOWFISH);
      }
      if ($mail == '') $mail = $userInit['mail'];
      if ($ville == '') $ville = $userInit['ville'];
      if ($description == '') $description = $userInit['description'];
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(':pseudo',$pseudo);
      $stmt->bindValue(':mail',$mail);
      $stmt->bindValue(':ville',$ville);
      $stmt->bindValue(':description',$description);
      $stmt->bindValue(':password',$cryptPassword);
      try{
        $stmt->execute();
        if ($stmt->rowCount() == 1){
          $res = $this->getUser($pseudo);
          return $res;
        }
        return FALSE;
      }catch(PDOException $e){
        return FALSE;
      }

    }
    /*
    * Récupère l'avatar d'un utilisateur
    * $pseudo : pseudo de l'utilisateur
    * résultat :
    *   si l'utilisateur existe : table assoc
    *    'mimetype' : mimetype de l'image
    *    'data' : flux ouvert en lecture sur les données binaires de l'image
    *     si l'utilisateur n'a pas d'avatar, 'mimetype' et 'data' valent NULL
    *   si l'utilisateur n'existe pas : le résultat vaut false
    */
   function getAvatar($pseudo){
      $sql = <<<EOD
      SELECT mimetype, avatar
      FROM carbix_avatar
      WHERE pseudo=:pseudo;
EOD;
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(':pseudo', $pseudo);
      $stmt->bindColumn('mimetype', $mimeType);
      $stmt->bindColumn('avatar', $flow, PDO::PARAM_LOB);
      $stmt->execute();
      $res = $stmt->fetch();
      if ($res)
         return ['mimetype'=>$mimeType,'data'=>$flow];
      else
         return false;
    }
    /*
    * Enregistre l'avatar d'un utilisateur dans la base de données.
    * $imageSpec : une table contenant le flux ouver "data" et le nom de l'image "mimetype".
    * $pseudo : le pseudo de l'utilisateur.
    */
    function storeAvatar($imageSpec, $pseudo){
      $sql = <<<EOD
      UPDATE carbix_avatar 
      SET mimetype=:mimetype,avatar=:avatar
      WHERE pseudo = :pseudo;
EOD;
      $stmt = $this->connexion->prepare($sql);
      $stmt->bindValue(':pseudo',$pseudo);
      $stmt->bindValue(':avatar', $imageSpec["data"], PDO::PARAM_LOB);
      $stmt->bindValue(':mimetype', $imageSpec["mimetype"]);
      try{
        $stmt->execute();
        return $stmt->rowCount() == 1;
      }catch(PDOException $e){
        return FALSE;
      }
  }

}
?>
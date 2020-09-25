<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

class Identite { 
  public $pseudo;
  public $mail;
  public $ville;
  public $description;
  public $nbavis;
  public $total;
  public $nbposts;
  public $nblike;
  public $nbnolike;
  
  public function __construct($pseudo,$mail,$ville,$description="",$nbavis=0,$total=0,$nbposts=0,$nblike=0,$nbnolike=0)
  {
    $this->pseudo = $pseudo;
    $this->mail = $mail;
    $this->ville = $ville;
    $this->description = $description;
    $this->nbavis = $nbavis;
    $this->total = $total;
    $this->nbposts = $nbposts;
    $this->nblike = $nblike;
    $this->nbnolike = $nbnolike;
  }
}
?>
<?php
/* Author: Diallo Mamadou et Barry Mamadou*/
function communeInput(){
  return "<input type='text' name='commune'
               required='required'
               placeholder='La commune* ' size='30' maxlength='40' 
         /><br/>";
}
function rayonInput(){
  return "<input type='number' name='rayon'
               placeholder='Le rayon (km)'
         /><br/>";
}
function carburantInputs(){
  return "<label >Faites votre choix de carburant</label><br>
         <input class='cbox' type='checkbox' name='carburant[]' value='1' checked> Gazole<br>
          <input class='cbox' type='checkbox' name='carburant[]' value='2' > SP95<br>
          <input class='cbox' type='checkbox' name='carburant[]' value='3'  > E85<br>
          <input class='cbox' type='checkbox' name='carburant[]' value='4' > GPLc<br>
          <input class='cbox' type='checkbox' name='carburant[]' value='5' > E10<br>
          <input class='cbox' type='checkbox' name='carburant[]' value='6' > SP98<br>";
}
function creeFormulaire(){
  $form = '<div id = "formulaire"><h2>Recherche</h2><form action="page.php" method="get"><fieldset>';
  $form .= communeInput().rayonInput()."<fieldset>".carburantInputs()."</fieldset>";
  $form .= '<button type="reset" name="reaset" value="suprime">Effacer</button>
         <button type="submit" name="validator" value="b1">Rechercher</button>
      </fieldset></form></div>';
  return $form;
}

         
         
         
        

<!--DIALLO Mamadou et BARRY Mamadou-->
<form action="..." method="GET" id = form_recherche>
     <fieldset>
          <legend>Recherche</legend>
          <input type='text' name='commune' required='required' placeholder='La commune* ' size='20' maxlength='20' /><br>
          <input type='number' name='rayon' placeholder='Le rayon (km)'/><br>
          <fieldset>
               <input class='cbox' type='checkbox' name='carburants[]' value='1' > <label> Gazole</label> 
               <input class='cbox' type='checkbox' name='carburants[]' value='6' > <label> SP95</label>
               <input class='cbox' type='checkbox' name='carburants[]' value='3'  ><label> E85</label>
               <input class='cbox' type='checkbox' name='carburants[]' value='4' ><label> GPLc</label>
               <input class='cbox' type='checkbox' name='carburants[]' value='5' ><label> E10</label>
               <input class='cbox' type='checkbox' name='carburants[]' value='2' ><label> SP98</label><br>
          </fieldset>
          <button type="submit" name="validator" value="ok">OK</button><br>
          <output  for="commune rayon carburant" name="message"></output>
     </fieldset>
</form>
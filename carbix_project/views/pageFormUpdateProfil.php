<!--DIALLO Mamadou et BARRY Mamadou-->
<form action="services/updateProfil.php" method="POST" id = "form_updateProfil">

	<fieldset>
		<legend>Modfier votre profil</legend>
		<input type="password" name="password" id="password" placeholder="Nouveau/Ancien password*"/>
		<input type="email" name="mail" placeholder='mail' size='20' maxlength='20'>
		<input type="text" name="ville" placeholder='ville' size='20' maxlength='20'><br/><br/>
		<label for="description"><strong>&darr;</strong> Une description maximum 1024 caractères</label><br/>
		<textarea id = 'description' name="description" cols="50" rows="7" maxlength="1024"></textarea>
	    <button type="submit" name="valid">OK</button><br/>
	    <output  for="password mail ville description" name="message"></output>
	</fieldset>
</form>

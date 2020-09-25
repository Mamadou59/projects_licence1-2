<!--DIALLO Mamadou et BARRY Mamadou-->
<section id = "blocLogin">
  <h6 hidden="">1</h6>
  <form method="POST" action="services/login.php" id="form_login">
    <fieldset>
      <legend>Authentifiez-vous</legend>
      <input type="text" name="login" id="login" required="required" autofocus placeholder='Pseudo*'/>
      <input type="password" name="password" id="password1" required="required" placeholder="Password*"/>
      <button type="submit" name="valid">OK</button><br/>
      <output  for="login password" name="message"></output>
    </fieldset>
  </form>
  <p>Pas encore inscrit ? <button class ="creationCompte">créer un compte</button></p>
</section>
<section id = "register">
  <h6 hidden="">2</h6>
  <form method="POST" action="services/createUtilisateur.php" id ="form_register">
      <fieldset>
        <legend>Créer votre compte</legend>
      <input type="text" name="pseudo" id="pseudo" required="required" placeholder="Pseudo*"  />
      <input type="password" name="password" id="password2" required="required" placeholder="Password*"/>
      <button type="submit" name="valid">OK</button><br>
      <output  for="login password" name="message"></output>
    </fieldset>
  </form>
</section>

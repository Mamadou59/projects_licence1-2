<?php
/*AUTHORS: DIALLO Mamadou & BARRY Mamadou*/

    set_include_path('..'.PATH_SEPARATOR);
    require('lib/watchdog_service.php');
    $login = $_SESSION['ident'];
    session_destroy();
    produceResult($login);

?> 



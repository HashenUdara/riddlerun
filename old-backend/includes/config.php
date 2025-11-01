<?php
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'riddle_user');
define('DB_PASSWORD', 'riddle_password');
define('DB_NAME', 'riddle_db');

define('DOMAIN', "https://api.saliya.me/2.0");
// define('DOMAIN', "https://riddlerun.ucscieee.lk");
// define('DOMAIN', "http://127.0.0.1/riddle-run-2023");
// define('DOMAIN', "http://192.168.1.5/riddle-run-2023");
// define('DOMAIN', "http://127.0.0.1/api.saliya.me/2.0");

$mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

if ($mysqli === false) {
    die("ERROR: Could not connect. " . $mysqli->connect_error);
}

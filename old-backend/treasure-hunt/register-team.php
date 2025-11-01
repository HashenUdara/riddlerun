<?php
include_once "../includes/DBController.php";
date_default_timezone_set("Asia/Colombo");

if (isset($_SERVER['HTTP_ORIGIN'])) {
    // riddlerun.ucscieee.lk
    $allowed_origins = array("http://riddlerun.ucscieee.lk", "https://riddlerun.ucscieee.lk");
    if (in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
        header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 1000');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    }
}

$db_handle = new DBController();

// CREATE TABLE teams (
//     id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
//     name VARCHAR(200) NOT NULL,
//     password VARCHAR(200) NOT NULL
// );

// $query = "SELECT * FROM registrations WHERE ?";
// $result = $db_handle->runQuery($query, 's', array(true));

$requestStatus = 0;
$required_vars = ['teamID', 'password'];
if (isset($_POST['register'])) {
    $data = $_POST["register"];
    foreach ($required_vars as $value_name) {
        if (!isset($data[$value_name]) || $data[$value_name] == "")
            die(json_encode(array("status" => "400", "desc" => "Please fill all the required input fields")));
    }

    $teamID = filter_var($data["teamID"], FILTER_SANITIZE_NUMBER_INT);
    $password = filter_var($data["password"], FILTER_SANITIZE_STRING);

    $query = "SELECT * FROM teams WHERE id = ? AND password = ?";
    $result = $db_handle->runQuery($query, 'is', array($teamID, $password));

    if (count($result) == 0) {
        die(json_encode(array("status" => "400", "desc" => "Invalid team ID or password")));
    }

    $name = $result[0]["name"];

    die(json_encode(array("status" => "200", "desc" => "Team registered successfully", "team-name" => $name)));
}

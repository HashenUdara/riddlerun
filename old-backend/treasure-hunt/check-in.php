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

$requestStatus = 0;
$required_vars = ['hash', 'teamID', 'password'];
if (isset($_POST['check_in'])) {
    $data = $_POST["check_in"];
    foreach ($required_vars as $value_name) {
        if (!isset($data[$value_name]) || $data[$value_name] == "")
            die(json_encode(array("status" => "400", "desc" => "Please fill all the required input fields")));
    }


    $teamID = filter_var($data["teamID"], FILTER_SANITIZE_NUMBER_INT);
    $password = filter_var($data["password"], FILTER_SANITIZE_STRING);
    $hash = filter_var($data["hash"], FILTER_SANITIZE_STRING);


    // authenticate team
    $query = "SELECT * FROM teams WHERE id = ? AND password = ?";
    $result = $db_handle->runQuery($query, 'is', array($teamID, $password));
    if (count($result) == 0)
        die(json_encode(array("status" => "400", "desc" => "Authentication failed")));

    $riddleIndex = $result[0]["riddleIndex"];

    // get checkpoint details
    $query = "SELECT * FROM checkpoints WHERE hash = ?";
    $result = $db_handle->runQuery($query, 's', array($hash));
    if (count($result) == 0)
        die(json_encode(array("status" => "400", "desc" => "Invalid checkpoint hash")));

    $checkpoint = $result[0];
    $name = $checkpoint["name"];
    $riddle = $checkpoint["riddle"];
    $checkpointID = $checkpoint["id"];

    // echo "Checkpoint name: $name $checkpointID";
    // echo "Checkpoint name: $name $checkpointID";


    // get team path
    $query = "SELECT * FROM teampath WHERE teamID = ? ORDER BY orderNum ASC";
    $result = $db_handle->runQuery($query, 'i', array($teamID));
    if (count($result) == 0)
        die(json_encode(array("status" => "400", "desc" => "Invalid team ID or password")));

    // print_r($result);

    // $values = $result[0];
    foreach ($result as $key => $value) {
        // check if all the checkpoints before this one are solved

        // print_r($value);
        // echo "Checkpoint ID: " . $value["checkpointID"] . " " . $checkpointID;

        if ($value["solved"] == 0 && $value["checkpointID"] != $checkpointID)
            die(json_encode(array("status" => "400", "desc" => "Please solve the previous checkpoints first")));

        if ($value["checkpointID"] != $checkpointID)
            continue;

        // check if this checkpoint is already solved
        $solved = $value["solved"];

        // update the checkpoint
        // $query = "UPDATE teampath SET solved = 1 WHERE teamID = ? AND checkpointID = ?";
        if ($solved == 0) {
            $query = "UPDATE teampath SET solved = 1, solvedTime = CURRENT_TIMESTAMP WHERE teamID = ? AND checkpointID = ?";
            $result1 = $db_handle->insert($query, 'ii', array($teamID, $checkpointID));
            if (!$result1)
                die(json_encode(array("status" => "400", "desc" => "Error while updating the checkpoint")));

            // update timestamp
            $query = "UPDATE teams SET timestamp = CURRENT_TIMESTAMP WHERE id = ?";
            $result1 = $db_handle->insert($query, 'i', array($teamID));
            if (!$result1)
                die(json_encode(array("status" => "400", "desc" => "Error while updating the timestamp")));
        }

        // name
        $checkpointName = $name;

        // get the next record from the $result and its riddle
        $nextCheckpoint = $result[$key + 1];
        $checkpointID = $nextCheckpoint["checkpointID"];

        // get the next checkpoint
        $query = "SELECT * FROM checkpoints WHERE id = ?";
        $result = $db_handle->runQuery($query, 'i', array($checkpointID));

        if (count($result) == 0) {
            $nextRiddle = "Congratulations! You have solved all the checkpoints. Please wait for the results.";
        } else {

            $nextCheckpoint = $result[0];
            // $name = $nextCheckpoint["name"];
            $riddle = $nextCheckpoint["riddle"];

            // $nextCheckpoint = $result[$key + 1];
            // $nextRiddle = $nextCheckpoint["riddle"];

            // print_r($nextCheckpoint);

            //             Array
            // (
            //     [id] => 2
            //     [name] => UCSC Open Area
            //     [hash] => 80672d909bcd0d62f90f2b1067253b950b6eb
            //     [riddle] => In a space where the winds gently sway,
            //         Where whispers of knowledge float through the day.
            //         Find the place where thoughts often blend,
            //         Beneath a quiet seat, your next clue awaits-my friend
            // )

            $nextRiddle = $nextCheckpoint["riddle"];

            // $nextRiddle = json_decode($nextCheckpoint["riddle"], true)[$riddleIndex - 1];
        }
        // die(json_encode(array("status" => "400", "desc" => "Error while getting the next checkpoint $checkpointID")));

        // send response
        die(json_encode(array("status" => "200", "desc" => "Checkpoint solved successfully", "riddle" => $nextRiddle, "name" => $checkpointName)));
    }


    die;
}

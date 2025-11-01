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

// get leaderboard by team with most checkpoints solved
// tiebreaker: team with least time

// echo (json_encode(array("status" => "200", "desc" => "Team registered successfully", "team-name" => $name)));

$query = "SELECT teams.id, teams.name, COUNT(teampath.id) AS solved, MAX(teampath.solvedTime) AS solvedTime FROM teams INNER JOIN teampath ON teams.id = teampath.teamID WHERE teampath.solved = ? GROUP BY teams.id ORDER BY solved DESC, solvedTime ASC";

$query = "SELECT teams.id, teams.name, COUNT(teampath.id) AS solved, teams.timestamp AS solvedTime FROM teams INNER JOIN teampath ON teams.id = teampath.teamID WHERE teampath.solved = ? GROUP BY teams.id ORDER BY solved DESC, solvedTime ASC";

$result = $db_handle->runQuery($query, 'i', array(1));

$teamIDs = array();
$leaderboard = array();

$rank = 1;
if (count($result) > 0) {
    foreach ($result as $row => $value) {

        array_push($teamIDs, $value["id"]);
        $leaderboard[] = array(
            "name" => $value["name"],
            "solved" => $value["solved"],
            "solvedTime" => $value["solvedTime"],
            "rank" => $rank++
        );

        // only increase rank if the next team has less solved checkpoints
        // also if there are two 1st place teams, the next team should be 3rd
        // if ($row < count($result) - 1 && $value["solved"] < $result[$row + 1]["solved"])
        //     $rank++;

        // if ($row < count($result) - 1 && $value["solved"] > $result[$row + 1]["solved"])
        //     $rank++;
    }
}

$rank = count($leaderboard) + 1;

// get teams with no solved checkpoints
$query = "SELECT teams.id, teams.name, COUNT(teampath.id) AS solved, MAX(teampath.solvedTime) AS solvedTime FROM teams LEFT JOIN teampath ON teams.id = teampath.teamID WHERE teampath.solved = ? GROUP BY teams.id ORDER BY solved DESC, solvedTime ASC";
$result = $db_handle->runQuery($query, 'i', array(0));

foreach ($result as $row => $value) {
    if (!in_array($value["id"], $teamIDs)) {
        $leaderboard[] = array(
            "name" => $value["name"],
            "solved" => 0,
            "solvedTime" => $value["solvedTime"],
            "rank" => $rank++
        );
    }
}

echo json_encode(array("status" => "200", "desc" => "Leaderboard found", "leaderboard" => $leaderboard));

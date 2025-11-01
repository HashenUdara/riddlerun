<?php
include_once "../includes/DBController.php";
date_default_timezone_set("Asia/Colombo");

// $DOMAIN = "https://riddlerun.ucscieee.lk";
// $DOMAIN = "http://127.0.0.1/api.saliya.me/2.0";
// $DOMAIN = "https://api.saliya.me/2.0"
$DOMAIN = DOMAIN;

$action = "teams";
$action = "checkpoints";
$action = "paths";
$action = "generate_links";

// get action from argument if provided
$validate_actions = ["teams", "checkpoints", "paths", "generate_links"];
if (isset($argv[1])) {
    $arg_action = $argv[1];
    if (in_array($arg_action, $validate_actions)) {
        $action = $arg_action;
    }
}

// NOTE: 
// you need to run the script 4 times each with a different action
// eg: bash> php create-team-hash.php teams
// actions should be in this order: teams, checkpoints, paths, generate_links
// or you can just change the logic to oneshot all :) I'm just lazy to touch this code again

$dry_run = true;

$db_handle = new DBController();


if ($action == "teams") {
    $names = ["Eren", "Mikasa", "Armin", "Levi ", "Marco", "Sasha", "Connie", "Reiner", "Bertolt", "Annie", "Ymir", "Historia", "Master Blaster"];
    $names = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima", "Mike", "November"];

    echo count($names) . "\n";

    // create 8 teams with random passwords
    $team_count = 8;
    for ($i = 1; $i <= $team_count; $i++) {
        $name = "Team " . $names[$i - 1];
        // $name = "Team $i";
        $password = substr(md5(rand()), 0, 50);

        // alternate ridde index from 1 to 3
        $riddleIndex = $i % 3 + 1;
        $riddleIndex = 1;
        echo "$name, $password, $riddleIndex\n";
        
        if ($dry_run) continue;

        $query = "INSERT INTO teams (name, password, riddleIndex) values (?, ?, ?)";
        $result = $db_handle->insert($query, 'ssi', array($name, $password, $riddleIndex));
    }
}

// $checkpoints = [
//     "Starting Point",
//     "Wall Maria",
//     "Wall Rose",
//     "Wall Sina",
//     "Trost District",
//     "Shiganshina District",
//     "The Forest of Giant Trees",
//     "The Interior",
//     "The Reiss Chapel",
//     "The Underground Chapel",
//     "The Founding Titan's throne room",
//     "The Beast Titan's village",
//     "The Survey Corps' headquarters",
//     "The Military Police Brigade's headquarters",
//     "The Royal Government Building",
//     "The MP's Special Operations Squad's headquarters",
//     "The Training Corps' headquarters",
//     "The First Interior Squad's headquarters",
//     "The Armoured Titan's village",
//     "The Anti-Personnel Control Squad's headquarters",
//     "The Beast Titan's forest",
//     "The Scout Regiment's supply and logistics squad's headquarters",
//     "The Survey Corps' supply and logistics squad's headquarters",
//     "The Beast Titan's forest"
// ];

$riddles = [
    "Starting Point" => [
        "I am the beginning of all journeys, the starting point of all paths. Where am I?",
    ],
    "UCSC Open Area" => [
        "In a space where the winds gently sway,
        Where whispers of knowledge float through the day.
        Find the place where thoughts often blend,
        Beneath a quiet seat, your next clue awaits-my friend",
    ],
    "Juicebar" => [
        "In a spot where flavors blend and freshness flows,
        A zesty concoction is where knowledge grows.
        Seek out the counter where colors unite,
        Your next clue is hidden-just take a bite!",
    ],
    "Science Canteen" => [
        "To find your next clue, head to the heart of discovery, where students gather to refuel between
        classes. This is the place where ideas are served alongside snacks, and conversations spark
        like chemical reactions. Look for a table that often hosts lively debates-your next clue is
        waiting in a spot where curiosity is always on the menu.",
    ],
    "Basketball court" => [
        "To uncover your next hint, navigate to the arena of strategy and skill, where movements are
        calculated like a well-crafted algorithm. Seek the spot near the hoop, where energy peaks and
        teamwork thrives, hidden in the shadows near the sidelines, waiting to be found with a little
        finesse-just like a well-timed dribble.",
    ],
    "Mini Planatarium" => [
        "ybirhgz kl wkh ftuq wjvb wkh qzslg zlfr vqsbv uvlro<br>19",
    ],
    "Pavilion" => [
        '
        <pre>
values = [36, 7, 25, 15, 24, 11, 18, 24]
for value in values:
    index = (value - 20) % 26
    if index == 0:
        index = 26
    letter = chr(index + 96)
    print(letter, end="")
print()
        </pre>
        ',
    ],
    "Medical Centre" => [
        "Think of the island that was shaped by a revolution led by a figure known for his resolve-Fidel
        Castro. This land is rich in history and resilience, where the echoes of change still resonate.
        Seek the spot that reflects this spirit of transformation, and beneath it, your clue awaits, hidden
        like the secrets of a past era",
    ],
    "Auditorium" => [
        '<pre>
values = [50, 46, 38, 19, 30, 22, 32, 29, 33]
for value in values:
    index = (value * 2 + 5) // 5
    if index > 26:
        index = 26
    letter = chr(index + 96)
    print(letter, end="")
print()
        </pre>
        ',
    ],
    "Science Faculty Open Area" => [
        "In a lively spot where hearts collide,
        UCSCcharm is hard to hide.
        With laughter shared and love in the air,
        Near the big tree where bright minds share.
        Look for a bench where many have run,
        Beneath its shade, your clue is spun!",
    ],
    "UCSC Canteen" => [
        "Known for its furry residents that roam freely and whispers of worms sneaking into the dishes,
        this place has stories to tell. Look beneath the table where the curious critters like to play, and
        there your clue awaits, hidden among the remnants of culinary escapades!",
    ],
    "end" => [
        "I am the beginning of the journey, where the adventure starts and the rules are set. 
        I am the place where the story unfolds and the players met. 
        What am I?
        ",
    ],
];

echo "Riddles count " . count($riddles) . "\n";
echo "<br/><br/>";
$titles = array_keys($riddles);

$start = "Starting Point";
$endCheckpoint = "S104";
$endCheckpoint = "end";

$startCheckpointIndex = array_search($start, $titles);
$endCheckpointIndex = array_search($endCheckpoint, $titles);

$startCheckpointIndex++;
$endCheckpointIndex++;


if ($action == "checkpoints") {

    $longetRiddle = 0;
    $i = 0;
    foreach ($riddles as $checkpoint => $riddle) {
        $i++;
        $hash = bin2hex(random_bytes(12)) . uniqid();
        
        $riddle = $riddle[0];

        $strlen = strlen($riddle);
        if ($strlen > $longetRiddle)
            $longetRiddle = $strlen;

        echo "$i $checkpoint<br/>";

        if ($dry_run) continue;

        $query = "INSERT INTO checkpoints (name, hash, riddle) values (?, ?, ?)";
        $result = $db_handle->insert($query, 'sss', array($checkpoint, $hash, $riddle));
    }


    echo "Longest riddle: " . $longetRiddle . "\n";
}

// a team has a path with n checkpoints
// should start from the starting point and end the end point
// starting and end point do not count towards the n checkpoints
// the checkpoints in between should be random
// the checkpoints in the path should be unique

// $team_paths = [
//     [1, 11, 14, 2, 3, 23, 9, 24],
//     [1, 21, 20, 9, 18, 19, 23, 24],
//     [1, 20, 18, 7, 21, 4, 6, 24],
//     [1, 15, 19, 18, 17, 21, 14, 24],
//     [1, 18, 12, 13, 7, 16, 10, 24],
//     [1, 6, 3, 17, 20, 22, 2, 24],
//     [1, 23, 11, 18, 6, 3, 14, 24],
//     [1, 23, 5, 6, 22, 2, 10, 24],
//     [1, 5, 23, 9, 3, 19, 6, 24],
//     [1, 11, 13, 4, 2, 7, 6, 24],
//     [1, 11, 16, 4, 7, 2, 19, 24],
//     [1, 4, 7, 2, 16, 15, 9, 24],
// ];

// Lab Bag Rack
//     [15] => Medical
//     [16] => K.G. Hall
//     [17] => Music Room
//     [18] => Science Car Park

// checkpoints with encryption riddles
// a team must have at least one encryption riddle in their path
$encryption_checkpoints = [15, 16, 17, 19];

if ($action == "paths") {

    $teamCount = 8;

    $mandatoryCheckpoints = [
        "Auditorium",
    ];

    $mandatoryCheckpointIndex = array_search($mandatoryCheckpoints[0], $titles) + 1;

    for ($i = 0; $i < $teamCount; $i++) {

        $path = array();

        $path[] = $startCheckpointIndex;

        $checkpointCount = 6;
        for ($j = 0; $j < $checkpointCount; $j++) {

            // if midpoint
            $checkpointIndex = rand(1, count($titles) - 1);

            // if ($j == ($checkpointCount / 2) + 1)
            //     $checkpointIndex = $encryption_checkpoints[rand(0, count($encryption_checkpoints) - 1)];

            while (in_array($checkpointIndex, $path))
                $checkpointIndex = rand(1, count($titles) - 1);

            if ($j == ($checkpointCount / 2)) {
                // echo "Midpoint\n";
                // add the mandatory checkpoint if not already in the path
                if (!in_array($mandatoryCheckpointIndex, $path)) {
                    // echo "Mandatory\n";
                    $checkpointIndex = $mandatoryCheckpointIndex;
                }
            }

            // echo "checkpointIndex: $checkpointIndex\n";
            // echo $titles[$checkpointIndex - 1] . "\n";

            $path[] = $checkpointIndex;
        }

        // add the end point
        $path[] = $endCheckpointIndex;

        echo "\n";

        $checkpoint_string = "";
        for ($j = 0; $j < count($path); $j++) {
            // get path index and get titles from that index
            $index = $path[$j];
            $checkpoint = $titles[$index - 1];
            $checkpoint_string .= "$checkpoint => ";
        }

        // remove the last arrow
        $checkpoint_string = substr($checkpoint_string, 0, -4);
        echo "Team " . ($i + 1) . ":\n";
        echo $checkpoint_string;
        echo "\n" . json_encode($path) . "\n";

        // get the path from the array
        // $path = $team_paths[$i];

        // insert the path into the database
        foreach ($path as $orderNum => $checkpointIndex) {
            // echo "teamID: " . ($i + 1) . ", checkpointID: $checkpointIndex, orderNum: $orderNum\n";
            if ($dry_run) continue;

            $query = "INSERT INTO teampath (teamID, checkpointID, orderNum) values (?, ?, ?)";
            $result = $db_handle->insert($query, 'iii', array($i + 1, $checkpointIndex, $orderNum));
        }

        // print_r($path);

        // $path = json_encode($path);
        // echo "$path\n";
        continue;
    }

}

// 127.0.0.1/saliya.me/ieeeday/treasure-hunt/register?teamID=${teamID}&password=${password}

$csv = "";
$api_links = array();

if ($action == "generate_links") {

    $query = "SELECT * FROM teams WHERE ?";
    $result = $db_handle->runQuery($query, 's', array(true));

    $current_dir = getcwd();
    $current_dir = str_replace("\\", "/", $current_dir);

    foreach ($result as $row) {
        $teamID = $row['id'];
        $password = $row['password'];
        $name = $row['name'];

        // echo "https://saliya.ml/ieeeday/treasure-hunt/register?teamID=$teamID&password=$password\n";

        $original = $url = "$DOMAIN/register?teamID=$teamID&password=$password";
        $url = urlencode($url);
        $url = "https://api.qrserver.com/v1/create-qr-code/?data=$url&size=1000x1000&margin=20";

        // $api_links[] = "https://api.qrserver.com/v1/create-qr-code/?data=$url&size=1000x1000&margin=10";

        echo "<a target='_blank' href='$url'>$name</a> <a target='_blank' href='$original'>link</a><br>";

        // write the qr code image to a file
        $imageData = file_get_contents($url);
        $imageName = "team_qr_$name" . "_" . "$teamID.png";
        $imageName = "teams/$imageName";
        $imageName = $current_dir . "/" . $imageName;
        file_put_contents($imageName, $imageData);
    }

    echo "<br><br>";

    $query = "SELECT * FROM checkpoints WHERE ?";
    $result = $db_handle->runQuery($query, 's', array(true));

    foreach ($result as $row) {
        $hash = $row['hash'];
        $name = $row['name'];
        $id = $row['id'];

        // echo "$id $name\n";
        // echo "https://saliya.ml/ieeeday/treasure-hunt/check-in?hash=$hash\n";

        $original = $url = "$DOMAIN/check-in?hash=$hash";
        $url = urlencode($url);
        $url = "https://api.qrserver.com/v1/create-qr-code/?data=$url&size=1000x1000&margin=20";

        echo "<a target='_blank' href='$url'>$id $name $hash</a> <a target='_blank' href='$original'>link</a><br>";

        // write the qr code image to a file
        $imageData = file_get_contents($url);
        $imageName = "checkpoint_qr_$name" . "_" . "$id.png";
        $imageName = "checkpoints/$imageName";
        $imageName = $current_dir . "/" . $imageName;
        file_put_contents($imageName, $imageData);

        // echo "http://127.0.0.1/ieeedaygithub/treasure-hunt/check-in?hash=$hash\n";
    }
}

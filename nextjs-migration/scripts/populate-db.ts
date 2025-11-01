import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'riddle.db');

// Remove old database if exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    riddleIndex INTEGER NOT NULL DEFAULT 1,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE checkpoints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    hash TEXT NOT NULL,
    riddle TEXT NOT NULL
  );

  CREATE TABLE teampath (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teamID INTEGER NOT NULL,
    checkpointID INTEGER NOT NULL,
    solved INTEGER DEFAULT 0,
    solvedTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    orderNum INTEGER NOT NULL,
    FOREIGN KEY (teamID) REFERENCES teams(id),
    FOREIGN KEY (checkpointID) REFERENCES checkpoints(id)
  );
`);

// Insert sample data from SQL dump
const teams = [
  [1, 'Team Alpha', 'e0b43c55dc84e15496a758d9246e5ece', 1, '2024-11-01 22:07:00'],
  [2, 'Team Bravo', 'eacc71af36b53e843beea9db33fc6eb3', 1, '2024-11-01 21:58:21'],
  [3, 'Team Charlie', '346017992a152fe86753305debe95cfe', 1, '2024-11-01 22:04:43'],
  [4, 'Team Delta', '7bf5a92e044c65036eab6ded619fa602', 1, '2024-11-01 22:06:39'],
  [5, 'Team Echo', 'a8cf59205f97032d002bf2d09a364144', 1, '2024-11-01 21:50:18'],
  [6, 'Team Foxtrot', '069c370159ae3e1bf6d7956cea81a857', 1, '2024-11-01 21:50:18'],
  [7, 'Team Golf', '30e4fb18d35c2db082d5f4461cc59afd', 1, '2024-11-01 21:50:18'],
  [8, 'Team Hotel', '75fcdd7f0a2a623ce2051713b2dc46d8', 1, '2024-11-01 21:50:18'],
];

const insertTeam = db.prepare('INSERT INTO teams (id, name, password, riddleIndex, timestamp) VALUES (?, ?, ?, ?, ?)');
for (const team of teams) {
  insertTeam.run(...team);
}

// Insert checkpoints
const checkpoints = [
  [1, 'Starting Point', '589b1596f5c52037b0e7485d67253b9500eb1', 'I am the beginning of all journeys, the starting point of all paths. Where am I?'],
  [2, 'UCSC Open Area', '80672d909bcd0d62f90f2b1067253b950b6eb', 'In a space where the winds gently sway, Where whispers of knowledge float through the day. Find the place where thoughts often blend, Beneath a quiet seat, your next clue awaits-my friend'],
  [3, 'Juicebar', 'b43efc7912c8a9d0b0fb351267253b9511251', 'In a spot where flavors blend and freshness flows, A zesty concoction is where knowledge grows. Seek out the counter where colors unite, Your next clue is hidden-just take a bite!'],
  [4, 'Science Canteen', 'f4eab5230fd91d650f117e1567253b9521f5b', 'To find your next clue, head to the heart of discovery, where students gather to refuel between classes. This is the place where ideas are served alongside snacks, and conversations spark like chemical reactions. Look for a table that often hosts lively debates-your next clue is waiting in a spot where curiosity is always on the menu.'],
  [5, 'Basketball court', 'c852edcc9a6ee1d4d56b51ff67253b9529f4e', 'To uncover your next hint, navigate to the arena of strategy and skill, where movements are calculated like a well-crafted algorithm. Seek the spot near the hoop, where energy peaks and teamwork thrives, hidden in the shadows near the sidelines, waiting to be found with a little finesse-just like a well-timed dribble.'],
  [6, 'Mini Planatarium', '58da3d12bca88d5228d9d96367253b9530219', 'ybirhgz kl wkh ftuq wjvb wkh qzslg zlfr vqsbv uvlro<br>19'],
  [7, 'Pavilion', '6a56f18b0a3412eb0831a35867253b9536356', '<pre>values = [36, 7, 25, 15, 24, 11, 18, 24]\nfor value in values:\n    index = (value - 20) % 26\n    if index == 0:\n        index = 26\n    letter = chr(index + 96)\n    print(letter, end="")\nprint()</pre>'],
  [8, 'Medical Centre', '02e35703b413790be110fa1d67253b953c6cc', 'Think of the island that was shaped by a revolution led by a figure known for his resolve-Fidel Castro. This land is rich in history and resilience, where the echoes of change still resonate. Seek the spot that reflects this spirit of transformation, and beneath it, your clue awaits, hidden like the secrets of a past era'],
  [9, 'Auditorium', '675ae03de97de740e1f1811e67253b9561849', '<pre>values = [50, 46, 38, 19, 30, 22, 32, 29, 33]\nfor value in values:\n    index = (value * 2 + 5) // 5\n    if index > 26:\n        index = 26\n    letter = chr(index + 96)\n    print(letter, end="")\nprint()</pre>'],
  [10, 'Science Faculty Open Area', '639f007743a826bc8df1346267253b957557a', 'In a lively spot where hearts collide, UCSC charm is hard to hide. With laughter shared and love in the air, Near the big tree where bright minds share. Look for a bench where many have run, Beneath its shade, your clue is spun!'],
  [11, 'UCSC Canteen', '5e3048ae217b54eeb1b9da0b67253b957b63d', 'Known for its furry residents that roam freely and whispers of worms sneaking into the dishes, this place has stories to tell. Look beneath the table where the curious critters like to play, and there your clue awaits, hidden among the remnants of culinary escapades!'],
  [12, 'end', 'd94c94d7e9dc29f8681e578b67253b958184b', 'I am the beginning of the journey, where the adventure starts and the rules are set. I am the place where the story unfolds and the players met. What am I?'],
];

const insertCheckpoint = db.prepare('INSERT INTO checkpoints (id, name, hash, riddle) VALUES (?, ?, ?, ?)');
for (const checkpoint of checkpoints) {
  insertCheckpoint.run(...checkpoint);
}

// Insert team paths
const teampaths = [
  [1, 1, 1, 1, '2024-11-02 03:22:44', 0],
  [2, 1, 10, 1, '2024-11-02 03:22:51', 1],
  [3, 1, 6, 1, '2024-11-02 03:22:55', 2],
  [4, 1, 2, 1, '2024-11-02 03:22:59', 3],
  [5, 1, 9, 1, '2024-11-02 03:37:00', 4],
  [6, 1, 8, 0, '2024-11-02 02:47:50', 5],
  [7, 1, 4, 0, '2024-11-02 02:47:50', 6],
  [8, 1, 12, 0, '2024-11-02 02:47:50', 7],
  [9, 2, 1, 1, '2024-11-02 03:27:42', 0],
  [10, 2, 5, 1, '2024-11-02 03:27:49', 1],
  [11, 2, 7, 1, '2024-11-02 03:28:06', 2],
  [12, 2, 9, 1, '2024-11-02 03:28:21', 3],
  [13, 2, 3, 0, '2024-11-02 02:47:50', 4],
  [14, 2, 8, 0, '2024-11-02 02:47:50', 5],
  [15, 2, 6, 0, '2024-11-02 02:47:50', 6],
  [16, 2, 12, 0, '2024-11-02 02:47:50', 7],
  [17, 3, 1, 1, '2024-11-02 03:34:20', 0],
  [18, 3, 10, 1, '2024-11-02 03:34:29', 1],
  [19, 3, 6, 1, '2024-11-02 03:34:33', 2],
  [20, 3, 7, 1, '2024-11-02 03:34:42', 3],
  [21, 3, 9, 0, '2024-11-02 02:47:50', 4],
  [22, 3, 2, 0, '2024-11-02 02:47:50', 5],
  [23, 3, 8, 0, '2024-11-02 02:47:51', 6],
  [24, 3, 12, 0, '2024-11-02 02:47:51', 7],
  [25, 4, 1, 1, '2024-11-02 03:36:39', 0],
  [26, 4, 5, 0, '2024-11-02 02:47:51', 1],
  [27, 4, 4, 0, '2024-11-02 02:47:51', 2],
  [28, 4, 2, 0, '2024-11-02 02:47:51', 3],
  [29, 4, 9, 0, '2024-11-02 02:47:51', 4],
  [30, 4, 7, 0, '2024-11-02 02:47:51', 5],
  [31, 4, 10, 0, '2024-11-02 02:47:51', 6],
  [32, 4, 12, 0, '2024-11-02 02:47:51', 7],
  [33, 5, 1, 0, '2024-11-02 02:47:51', 0],
  [34, 5, 7, 0, '2024-11-02 02:47:51', 1],
  [35, 5, 9, 0, '2024-11-02 02:47:51', 2],
  [36, 5, 10, 0, '2024-11-02 02:47:51', 3],
  [37, 5, 3, 0, '2024-11-02 02:47:51', 4],
  [38, 5, 5, 0, '2024-11-02 02:47:51', 5],
  [39, 5, 6, 0, '2024-11-02 02:47:51', 6],
  [40, 5, 12, 0, '2024-11-02 02:47:51', 7],
  [41, 6, 1, 0, '2024-11-02 02:47:51', 0],
  [42, 6, 8, 0, '2024-11-02 02:47:51', 1],
  [43, 6, 2, 0, '2024-11-02 02:47:51', 2],
  [44, 6, 4, 0, '2024-11-02 02:47:51', 3],
  [45, 6, 9, 0, '2024-11-02 02:47:51', 4],
  [46, 6, 5, 0, '2024-11-02 02:47:51', 5],
  [47, 6, 10, 0, '2024-11-02 02:47:51', 6],
  [48, 6, 12, 0, '2024-11-02 02:47:51', 7],
  [49, 7, 1, 0, '2024-11-02 02:47:51', 0],
  [50, 7, 7, 0, '2024-11-02 02:47:51', 1],
  [51, 7, 10, 0, '2024-11-02 02:47:51', 2],
  [52, 7, 11, 0, '2024-11-02 02:47:51', 3],
  [53, 7, 9, 0, '2024-11-02 02:47:51', 4],
  [54, 7, 4, 0, '2024-11-02 02:47:51', 5],
  [55, 7, 8, 0, '2024-11-02 02:47:51', 6],
  [56, 7, 12, 0, '2024-11-02 02:47:51', 7],
  [57, 8, 1, 0, '2024-11-02 02:47:51', 0],
  [58, 8, 10, 0, '2024-11-02 02:47:51', 1],
  [59, 8, 4, 0, '2024-11-02 02:47:51', 2],
  [60, 8, 7, 0, '2024-11-02 02:47:52', 3],
  [61, 8, 9, 0, '2024-11-02 02:47:52', 4],
  [62, 8, 5, 0, '2024-11-02 02:47:52', 5],
  [63, 8, 6, 0, '2024-11-02 02:47:52', 6],
  [64, 8, 12, 0, '2024-11-02 02:47:52', 7],
];

const insertTeampath = db.prepare('INSERT INTO teampath (id, teamID, checkpointID, solved, solvedTime, orderNum) VALUES (?, ?, ?, ?, ?, ?)');
for (const teampath of teampaths) {
  insertTeampath.run(...teampath);
}

console.log('Database populated successfully!');
db.close();


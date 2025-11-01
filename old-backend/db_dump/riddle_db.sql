-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: REDACTED
-- Generation Time: Sep 20, 2024 at 07:12 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `riddle_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `checkpoints`
--

CREATE TABLE `checkpoints` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `hash` varchar(200) NOT NULL,
  `riddle` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `checkpoints`
--

INSERT INTO `checkpoints` (`id`, `name`, `hash`, `riddle`) VALUES
(1, 'Starting Point', '589b1596f5c52037b0e7485d67253b9500eb1', 'I am the beginning of all journeys, the starting point of all paths. Where am I?'),
(2, 'UCSC Open Area', '80672d909bcd0d62f90f2b1067253b950b6eb', 'In a space where the winds gently sway,\n        Where whispers of knowledge float through the day.\n        Find the place where thoughts often blend,\n        Beneath a quiet seat, your next clue awaits-my friend'),
(3, 'Juicebar', 'b43efc7912c8a9d0b0fb351267253b9511251', 'In a spot where flavors blend and freshness flows,\r\n        A zesty concoction is where knowledge grows.\r\n        Seek out the counter where colors unite,\r\n        Your next clue is hidden-just take a bite!'),
(4, 'Science Canteen', 'f4eab5230fd91d650f117e1567253b9521f5b', 'To find your next clue, head to the heart of discovery, where students gather to refuel between\r\n        classes. This is the place where ideas are served alongside snacks, and conversations spark\r\n        like chemical reactions. Look for a table that often hosts lively debates-your next clue is\r\n        waiting in a spot where curiosity is always on the menu.'),
(5, 'Basketball court', 'c852edcc9a6ee1d4d56b51ff67253b9529f4e', 'To uncover your next hint, navigate to the arena of strategy and skill, where movements are\r\n        calculated like a well-crafted algorithm. Seek the spot near the hoop, where energy peaks and\r\n        teamwork thrives, hidden in the shadows near the sidelines, waiting to be found with a little\r\n        finesse-just like a well-timed dribble.'),
(6, 'Mini Planatarium', '58da3d12bca88d5228d9d96367253b9530219', 'ybirhgz kl wkh ftuq wjvb wkh qzslg zlfr vqsbv uvlro<br>19'),
(7, 'Pavilion', '6a56f18b0a3412eb0831a35867253b9536356', '\r\n        <pre>\r\nvalues = [36, 7, 25, 15, 24, 11, 18, 24]\r\nfor value in values:\r\n    index = (value - 20) % 26\r\n    if index == 0:\r\n        index = 26\r\n    letter = chr(index + 96)\r\n    print(letter, end=\"\")\r\nprint()\r\n        </pre>\r\n        '),
(8, 'Medical Centre', '02e35703b413790be110fa1d67253b953c6cc', 'Think of the island that was shaped by a revolution led by a figure known for his resolve-Fidel\r\n        Castro. This land is rich in history and resilience, where the echoes of change still resonate.\r\n        Seek the spot that reflects this spirit of transformation, and beneath it, your clue awaits, hidden\r\n        like the secrets of a past era'),
(9, 'Auditorium', '675ae03de97de740e1f1811e67253b9561849', '<pre>\r\nvalues = [50, 46, 38, 19, 30, 22, 32, 29, 33]\r\nfor value in values:\r\n    index = (value * 2 + 5) // 5\r\n    if index > 26:\r\n        index = 26\r\n    letter = chr(index + 96)\r\n    print(letter, end=\"\")\r\nprint()\r\n        </pre>\r\n        '),
(10, 'Science Faculty Open Area', '639f007743a826bc8df1346267253b957557a', 'In a lively spot where hearts collide,\n        UCSC charm is hard to hide.\n        With laughter shared and love in the air,\n        Near the big tree where bright minds share.\n        Look for a bench where many have run,\n        Beneath its shade, your clue is spun!'),
(11, 'UCSC Canteen', '5e3048ae217b54eeb1b9da0b67253b957b63d', 'Known for its furry residents that roam freely and whispers of worms sneaking into the dishes,\r\n        this place has stories to tell. Look beneath the table where the curious critters like to play, and\r\n        there your clue awaits, hidden among the remnants of culinary escapades!'),
(12, 'end', 'd94c94d7e9dc29f8681e578b67253b958184b', 'I am the beginning of the journey, where the adventure starts and the rules are set. \r\n        I am the place where the story unfolds and the players met. \r\n        What am I?\r\n        ');

-- --------------------------------------------------------

--
-- Table structure for table `teampath`
--

CREATE TABLE `teampath` (
  `id` int(11) NOT NULL,
  `teamID` int(11) NOT NULL,
  `checkpointID` int(11) NOT NULL,
  `solved` int(11) DEFAULT 0,
  `solvedTime` datetime DEFAULT current_timestamp(),
  `orderNum` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teampath`
--

INSERT INTO `teampath` (`id`, `teamID`, `checkpointID`, `solved`, `solvedTime`, `orderNum`) VALUES
(1, 1, 1, 1, '2024-11-02 03:22:44', 0),
(2, 1, 10, 1, '2024-11-02 03:22:51', 1),
(3, 1, 6, 1, '2024-11-02 03:22:55', 2),
(4, 1, 2, 1, '2024-11-02 03:22:59', 3),
(5, 1, 9, 1, '2024-11-02 03:37:00', 4),
(6, 1, 8, 0, '2024-11-02 02:47:50', 5),
(7, 1, 4, 0, '2024-11-02 02:47:50', 6),
(8, 1, 12, 0, '2024-11-02 02:47:50', 7),
(9, 2, 1, 1, '2024-11-02 03:27:42', 0),
(10, 2, 5, 1, '2024-11-02 03:27:49', 1),
(11, 2, 7, 1, '2024-11-02 03:28:06', 2),
(12, 2, 9, 1, '2024-11-02 03:28:21', 3),
(13, 2, 3, 0, '2024-11-02 02:47:50', 4),
(14, 2, 8, 0, '2024-11-02 02:47:50', 5),
(15, 2, 6, 0, '2024-11-02 02:47:50', 6),
(16, 2, 12, 0, '2024-11-02 02:47:50', 7),
(17, 3, 1, 1, '2024-11-02 03:34:20', 0),
(18, 3, 10, 1, '2024-11-02 03:34:29', 1),
(19, 3, 6, 1, '2024-11-02 03:34:33', 2),
(20, 3, 7, 1, '2024-11-02 03:34:42', 3),
(21, 3, 9, 0, '2024-11-02 02:47:50', 4),
(22, 3, 2, 0, '2024-11-02 02:47:50', 5),
(23, 3, 8, 0, '2024-11-02 02:47:51', 6),
(24, 3, 12, 0, '2024-11-02 02:47:51', 7),
(25, 4, 1, 1, '2024-11-02 03:36:39', 0),
(26, 4, 5, 0, '2024-11-02 02:47:51', 1),
(27, 4, 4, 0, '2024-11-02 02:47:51', 2),
(28, 4, 2, 0, '2024-11-02 02:47:51', 3),
(29, 4, 9, 0, '2024-11-02 02:47:51', 4),
(30, 4, 7, 0, '2024-11-02 02:47:51', 5),
(31, 4, 10, 0, '2024-11-02 02:47:51', 6),
(32, 4, 12, 0, '2024-11-02 02:47:51', 7),
(33, 5, 1, 0, '2024-11-02 02:47:51', 0),
(34, 5, 7, 0, '2024-11-02 02:47:51', 1),
(35, 5, 9, 0, '2024-11-02 02:47:51', 2),
(36, 5, 10, 0, '2024-11-02 02:47:51', 3),
(37, 5, 3, 0, '2024-11-02 02:47:51', 4),
(38, 5, 5, 0, '2024-11-02 02:47:51', 5),
(39, 5, 6, 0, '2024-11-02 02:47:51', 6),
(40, 5, 12, 0, '2024-11-02 02:47:51', 7),
(41, 6, 1, 0, '2024-11-02 02:47:51', 0),
(42, 6, 8, 0, '2024-11-02 02:47:51', 1),
(43, 6, 2, 0, '2024-11-02 02:47:51', 2),
(44, 6, 4, 0, '2024-11-02 02:47:51', 3),
(45, 6, 9, 0, '2024-11-02 02:47:51', 4),
(46, 6, 5, 0, '2024-11-02 02:47:51', 5),
(47, 6, 10, 0, '2024-11-02 02:47:51', 6),
(48, 6, 12, 0, '2024-11-02 02:47:51', 7),
(49, 7, 1, 0, '2024-11-02 02:47:51', 0),
(50, 7, 7, 0, '2024-11-02 02:47:51', 1),
(51, 7, 10, 0, '2024-11-02 02:47:51', 2),
(52, 7, 11, 0, '2024-11-02 02:47:51', 3),
(53, 7, 9, 0, '2024-11-02 02:47:51', 4),
(54, 7, 4, 0, '2024-11-02 02:47:51', 5),
(55, 7, 8, 0, '2024-11-02 02:47:51', 6),
(56, 7, 12, 0, '2024-11-02 02:47:51', 7),
(57, 8, 1, 0, '2024-11-02 02:47:51', 0),
(58, 8, 10, 0, '2024-11-02 02:47:51', 1),
(59, 8, 4, 0, '2024-11-02 02:47:51', 2),
(60, 8, 7, 0, '2024-11-02 02:47:52', 3),
(61, 8, 9, 0, '2024-11-02 02:47:52', 4),
(62, 8, 5, 0, '2024-11-02 02:47:52', 5),
(63, 8, 6, 0, '2024-11-02 02:47:52', 6),
(64, 8, 12, 0, '2024-11-02 02:47:52', 7);

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `riddleIndex` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `password`, `riddleIndex`, `timestamp`) VALUES
(1, 'Team Alpha', 'e0b43c55dc84e15496a758d9246e5ece', 1, '2024-11-01 22:07:00'),
(2, 'Team Bravo', 'eacc71af36b53e843beea9db33fc6eb3', 1, '2024-11-01 21:58:21'),
(3, 'Team Charlie', '346017992a152fe86753305debe95cfe', 1, '2024-11-01 22:04:43'),
(4, 'Team Delta', '7bf5a92e044c65036eab6ded619fa602', 1, '2024-11-01 22:06:39'),
(5, 'Team Echo', 'a8cf59205f97032d002bf2d09a364144', 1, '2024-11-01 21:50:18'),
(6, 'Team Foxtrot', '069c370159ae3e1bf6d7956cea81a857', 1, '2024-11-01 21:50:18'),
(7, 'Team Golf', '30e4fb18d35c2db082d5f4461cc59afd', 1, '2024-11-01 21:50:18'),
(8, 'Team Hotel', '75fcdd7f0a2a623ce2051713b2dc46d8', 1, '2024-11-01 21:50:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `checkpoints`
--
ALTER TABLE `checkpoints`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teampath`
--
ALTER TABLE `teampath`
  ADD PRIMARY KEY (`id`),
  ADD KEY `teamID` (`teamID`),
  ADD KEY `checkpointID` (`checkpointID`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `checkpoints`
--
ALTER TABLE `checkpoints`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `teampath`
--
ALTER TABLE `teampath`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `teampath`
--
ALTER TABLE `teampath`
  ADD CONSTRAINT `teampath_ibfk_1` FOREIGN KEY (`teamID`) REFERENCES `teams` (`id`),
  ADD CONSTRAINT `teampath_ibfk_2` FOREIGN KEY (`checkpointID`) REFERENCES `checkpoints` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

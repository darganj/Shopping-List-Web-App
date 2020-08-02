-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 12, 2020 at 12:38 AM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shoppingList`
--

-- --------------------------------------------------------

--
-- Table structure for table `Categories`
--

CREATE TABLE IF NOT EXISTS `Categories` (
  `categoryID` int(11) NOT NULL,
  `categoryName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Categories`
--

INSERT INTO `Categories` (`categoryID`, `categoryName`) VALUES
(1, 'Produce'),
(2, 'Dairy'),
(3, 'Bread/Bakery'),
(4, 'Beverages'),
(5, 'Meat'),
(6, 'Fish'),
(7, 'Frozen Foods'),
(8, 'Dry and Baking Goods');

-- --------------------------------------------------------

--
-- Table structure for table `Items`
--

CREATE TABLE IF NOT EXISTS `Items` (
  `itemID` int(11) NOT NULL,
  `categoryID` int(11) NOT NULL,
  `itemName` varchar(50) NOT NULL,
  `price` decimal(65,2) NOT NULL,
  `linkID` int(11) NOT NULL,
  `nutritionID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Items`
--

INSERT INTO `Items` (`itemID`, `categoryID`, `itemName`, `price`, `linkID`, `nutritionID`) VALUES
(1, 6, 'Salmon Fillet', '12.99', 1, 1),
(2, 3, 'Chocolate Chip Muffin', '0.99', 3, 3),
(3, 5, 'Chicken Legs', '7.45', 2, 2),
(4, 1, 'Avocado', '1.50', 5, 4),
(5, 1, 'Plum Tomato', '0.99', 4, 5),
(6, 5, 'Eggs - Dozen', '4.99', 6, 6),
(7, 5, 'Eggs (6x)', '2.99', 7, 6);

-- --------------------------------------------------------

--
-- Table structure for table `Links`
--

CREATE TABLE IF NOT EXISTS `Links` (
  `linkID` int(11) NOT NULL,
  `nameLink` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Links`
--

INSERT INTO `Links` (`linkID`, `nameLink`) VALUES
(1, 'https://d2d8wwwkmhfcva.cloudfront.net/800x/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_9099782f-f5bd-4e7d-9aba-f1ad05e3729e.jpg'),
(2, 'https://previews.123rf.com/images/volff/volff1904/volff190400084/120618168-raw-chicken-leg-isolated-on-white-background-.jpg'),
(3, 'https://www.handletheheat.com/wp-content/uploads/2009/09/Chocolate-Chip-Muffins-SQUARE.jpg'),
(4, 'https://hips.hearstapps.com/amv-prod-tpw.s3.amazonaws.com/wp-content/uploads/2009/01/3201575304_488661e9e8_o.jpg?crop=1xw:0.7517899761336515xh;center,top&resize=640:*'),
(5, 'https://cleananddelicious.com/wp-content/uploads/2016/03/Avocad0-CD.jpg'),
(6, 'https://previews.123rf.com/images/kozzi/kozzi1301/kozzi130114668/17494426-close-up-of-dozen-of-eggs-in-carton-box-isolated-over-white-background.jpg'),
(7, 'https://img.republicworld.com/republic-prod/stories/promolarge/xxhdpi/kgik6yeyypne1qg8_1586586208.jpeg?tr=w-812,h-464');

-- --------------------------------------------------------

--
-- Table structure for table `Lists`
--

CREATE TABLE IF NOT EXISTS `Lists` (
  `listID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `listCreated` date NOT NULL,
  `nameList` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Lists`
--

INSERT INTO `Lists` (`listID`, `userID`, `listCreated`, `nameList`) VALUES
(1, 1, '2020-07-11', 'Guacamole'),
(2, 1, '2020-07-10', 'Food for 7/13 week'),
(3, 3, '2020-07-11', 'Pick Up Today');

-- --------------------------------------------------------

--
-- Table structure for table `List_of_Items`
--

CREATE TABLE IF NOT EXISTS `List_of_Items` (
  `listOfItems` int(11) NOT NULL,
  `listID` int(11) NOT NULL,
  `itemID` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `List_of_Items`
--

INSERT INTO `List_of_Items` (`listOfItems`, `listID`, `itemID`, `quantity`) VALUES
(1, 1, 4, 2),
(2, 1, 5, 1),
(3, 2, 3, 3),
(4, 2, 2, 4),
(5, 2, 1, 2),
(6, 3, 7, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Nutritions`
--

CREATE TABLE IF NOT EXISTS `Nutritions` (
  `nutritionID` int(11) NOT NULL,
  `calories` int(11) NOT NULL,
  `fatContent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Nutritions`
--

INSERT INTO `Nutritions` (`nutritionID`, `calories`, `fatContent`) VALUES
(1, 170, 6),
(2, 264, 5),
(3, 125, 12),
(4, 234, 21),
(5, 11, 0),
(6, 75, 5);

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE IF NOT EXISTS `Users` (
  `userID` int(11) NOT NULL,
  `dateJoined` date NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `isAdmin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`userID`, `dateJoined`, `firstName`, `lastName`, `userName`, `password`, `isAdmin`) VALUES
(1, '2020-07-08', 'Jane', 'Smith', 'jsmith10', 'smithj10', 1),
(2, '2020-07-10', 'Aiden', 'Karlten', 'ninja_moves', 'porkchop', 0),
(3, '2020-07-11', 'Brad', 'Jonson', 'B_Jonson', 'food_1997', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Categories`
--
ALTER TABLE `Categories`
  ADD PRIMARY KEY (`categoryID`);

--
-- Indexes for table `Items`
--
ALTER TABLE `Items`
  ADD PRIMARY KEY (`itemID`),
  ADD KEY `typeID` (`categoryID`),
  ADD KEY `linkID` (`linkID`),
  ADD KEY `nutritionID` (`nutritionID`);

--
-- Indexes for table `Links`
--
ALTER TABLE `Links`
  ADD PRIMARY KEY (`linkID`);

--
-- Indexes for table `Lists`
--
ALTER TABLE `Lists`
  ADD PRIMARY KEY (`listID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `List_of_Items`
--
ALTER TABLE `List_of_Items`
  ADD PRIMARY KEY (`listOfItems`),
  ADD KEY `listID` (`listID`),
  ADD KEY `itemID` (`itemID`);

--
-- Indexes for table `Nutritions`
--
ALTER TABLE `Nutritions`
  ADD PRIMARY KEY (`nutritionID`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Categories`
--
ALTER TABLE `Categories`
  MODIFY `categoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Items`
--
ALTER TABLE `Items`
  MODIFY `itemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Links`
--
ALTER TABLE `Links`
  MODIFY `linkID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Lists`
--
ALTER TABLE `Lists`
  MODIFY `listID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `List_of_Items`
--
ALTER TABLE `List_of_Items`
  MODIFY `listOfItems` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Nutritions`
--
ALTER TABLE `Nutritions`
  MODIFY `nutritionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Items`
--
ALTER TABLE `Items`
  ADD CONSTRAINT `Items_ibfk_2` FOREIGN KEY (`nutritionID`) REFERENCES `Nutritions` (`nutritionID`),
  ADD CONSTRAINT `Items_ibfk_3` FOREIGN KEY (`linkID`) REFERENCES `Links` (`linkID`),
  ADD CONSTRAINT `Items_ibfk_4` FOREIGN KEY (`categoryID`) REFERENCES `Categories` (`categoryID`);

--
-- Constraints for table `Lists`
--
ALTER TABLE `Lists`
  ADD CONSTRAINT `Lists_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`);

--
-- Constraints for table `List_of_Items`
--
ALTER TABLE `List_of_Items`
  ADD CONSTRAINT `List_of_Items_ibfk_1` FOREIGN KEY (`itemID`) REFERENCES `Items` (`itemID`),
  ADD CONSTRAINT `List_of_Items_ibfk_2` FOREIGN KEY (`listID`) REFERENCES `Lists` (`listID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

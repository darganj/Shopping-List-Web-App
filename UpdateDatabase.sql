-- MySQL dump 10.13  Distrib 8.0.21, for Linux (x86_64)
--
-- Host: sulnwdk5uwjw1r2k.cbetxkdyhwsb.us-east-1.rds.amazonaws.com    Database: ug0maw3ctrh805y2
-- ------------------------------------------------------
-- Server version	5.7.23-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Categories` (
  `categoryID` int(11) NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(50) NOT NULL,
  PRIMARY KEY (`categoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES (1,'Produce'),(2,'Dairy'),(3,'Bread/Bakery'),(4,'Beverages'),(5,'Meat'),(6,'Fish'),(7,'Frozen Foods'),(8,'Dry and Baking Goods');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Items`
--

DROP TABLE IF EXISTS `Items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Items` (
  `itemID` int(11) NOT NULL AUTO_INCREMENT,
  `categoryID` int(11) NOT NULL,
  `itemName` varchar(50) NOT NULL,
  PRIMARY KEY (`itemID`),
  KEY `typeID` (`categoryID`),
  CONSTRAINT `Items_ibfk_4` FOREIGN KEY (`categoryID`) REFERENCES `Categories` (`categoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Items`
--

LOCK TABLES `Items` WRITE;
/*!40000 ALTER TABLE `Items` DISABLE KEYS */;
INSERT INTO `Items` VALUES (1,6,'Salmon Fillet'),(2,3,'Chocolate Chip Muffin'),(3,5,'Chicken Legs'),(4,1,'Avocado'),(5,1,'Plum Tomato'),(6,5,'Eggs - Dozen'),(7,5,'Eggs (6x)');
/*!40000 ALTER TABLE `Items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `List_of_Items`
--

DROP TABLE IF EXISTS `List_of_Items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `List_of_Items` (
  `listOfItems` int(11) NOT NULL AUTO_INCREMENT,
  `listID` int(11) NOT NULL,
  `itemID` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `markStatus` int(11),
  'itemNote' varchar(255),
  PRIMARY KEY (`listOfItems`),
  KEY `listID` (`listID`),
  KEY `itemID` (`itemID`),
  CONSTRAINT `List_of_Items_ibfk_1` FOREIGN KEY (`itemID`) REFERENCES `Items` (`itemID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `List_of_Items_ibfk_2` FOREIGN KEY (`listID`) REFERENCES `Lists` (`listID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `List_of_Items`
--

LOCK TABLES `List_of_Items` WRITE;
/*!40000 ALTER TABLE `List_of_Items` DISABLE KEYS */;
INSERT INTO `List_of_Items` VALUES (1,1,4,2,1,'note'),(2,1,5,1,1,'note2'),(3,2,3,3,1,'note again'),(4,2,2,4,1,'another one'),(5,2,1,2,1,'noted'),(6,3,7,1,1,'example note');
/*!40000 ALTER TABLE `List_of_Items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Lists`
--

DROP TABLE IF EXISTS `Lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Lists` (
  `listID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `listCreated` date NOT NULL,
  `nameList` varchar(50) NOT NULL,
  PRIMARY KEY (`listID`),
  KEY `userID` (`userID`),
  CONSTRAINT `Lists_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Lists`
--

LOCK TABLES `Lists` WRITE;
/*!40000 ALTER TABLE `Lists` DISABLE KEYS */;
INSERT INTO `Lists` VALUES (1,1,'2020-07-11','Guacamole'),(2,1,'2020-07-10','Food for 7/13 week'),(3,3,'2020-07-11','Pick Up Today');
/*!40000 ALTER TABLE `Lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `dateJoined` date DEFAULT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `userName` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isAdmin` int(11) DEFAULT '0',
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'2020-07-08','Jane','Smith','jsmith10','smithj10',1),(2,'2020-07-10','Aiden','Karlten','ninja_moves','porkchop',0),(3,'2020-07-11','Brad','Jonson','B_Jonson','food_1997',0),(4,'2020-07-30','Bob','Blue','bob','$argon2i$v=19$m=4096,t=3,p=1$8td0yDBC4ujGcOdUf2LWSA$ogRFw3Lqw/wpWP3ezbnNfQyxH8WokzuQ8pSBEaxK6OE',1),(5,NULL,NULL,NULL,'sue','$argon2i$v=19$m=4096,t=3,p=1$s4cPXulowliZzgjPzMNshQ$z3lRxDtxA7EZ5KG+dXeMss26Sf0qlt++I8avcNHAM5I',0),(6,NULL,NULL,NULL,'ray','$argon2i$v=19$m=4096,t=3,p=1$h+z61KWM+aoKu9u5IB48Ww$TyYaugUHr+WEp6b4J2a2/DKSjSuRknNLfRM6A6JA9gs',0),(7,NULL,NULL,NULL,'robby','$argon2i$v=19$m=4096,t=3,p=1$FKUd+3HA8Wb1AbaD0VxYvg$tytu4sJo/URQdIxhd5zTWBGbb7M9rbqI88AThAOoLXc',0),(8,NULL,NULL,NULL,'stingray','$argon2i$v=19$m=4096,t=3,p=1$/kgz8YG6oaDneHR6BMD03g$lDx0tu39rvXxhCMJzjTqpXhESLqz85hi7sM1/Xrjx6g',0),(9,NULL,NULL,NULL,'cat','$argon2i$v=19$m=4096,t=3,p=1$WGQIS3e6PXfo8Hyfo5fLFw$vubXuC4O+o24RXn9VTJRVwYhQxjNY02wtP8oeislY/E',0);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('0NSaBbal1pZz-DPff0FttTFBp-XhERJh',1596176873,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('0b2zGf1leoJqKxiW1C5bs7qxPuFbx9KW',1596095686,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":4}}'),('5q4rzGBQLivUyThDUAz-tpkKEswYlK-q',1596173449,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"returnTo\":\"/edit-list\"}'),('C-wnuxeiKXjA865Bya6hTTlQZmLdS8j3',1596094549,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":1}}'),('EFB_m9qld9oR6YbJ0gFD6PnyMuJRnGeq',1596177345,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('GPyu-AHUqZsAFA34AcSl0qYjDv2kG79i',1596175877,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{}}'),('NyNwfY4xCS96Fk9AR-MG0PfRzFKyMPcQ',1596181693,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{}}'),('QfPpZ8Pmk0vWlOcJHCHbXbhWOC1PCjHV',1596176714,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('S-i4ifQrIB24wBIEdmBO_2gbBMBIh9hK',1596175311,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{},\"returnTo\":\"/shoppinglist\"}'),('SLvhIbnAk7zg0jt65YE5LpEL_GQ-A9o-',1596161720,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":4}}'),('UtngaVcimk3NsqQ__D-E2DLPFmppduQ8',1596158768,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"returnTo\":\"/admin-portal\",\"passport\":{\"user\":4}}'),('XbcGERXPmI7lu4u6CPrbxbOVkfnbLA2V',1596176664,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('ZOYzZIWDMA1W3ezVnAlkqSfLL57IdUao',1596094576,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('_2RCPpg-nLhKdr8nBhizVEw0sUCRZWdQ',1596175997,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('f2jgVEr3z9x9Vj6WeMpmYkuI7dDLAWOz',1596182677,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{},\"returnTo\":\"/shoppinglist\"}'),('gEzodfvE-8lK2JRQw-p4rOOWWhjN5roY',1596095709,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('gO2hoJc30Yvot5zNi_87lI86w1NPjpKq',1596095749,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('gkmRK6Yu2FUCnZtE5ElDERdMhkYQcY2o',1596176664,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('iVsbuFdyYuh3o1DydpA2WaPLuKpQHvmb',1596094576,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('k4Im_YcMt_4v-9qFBYZUjTyBmtl-IMCO',1596094576,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('kFjepf7nBPo3DtDtTk3KzluitXJh4zOW',1596176664,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('lBB7nt9ghMBevExsWksnjkjFS4-AkPEh',1596094361,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":4}}'),('pD1w47yauUSEWa59VLwcXlejD2zM63ra',1596181975,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('rKSJBlYt2zZD5Yb-58_84T6UtPjNDK4U',1596176624,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('rNMRaEKsj07Y7UXT9epe2yJWLtHue9LM',1596176068,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('yimq8su9D5tH6-ZMuB1KzPys1RBFXyDh',1596181975,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"returnTo\":\"/shoppinglist\"}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-07-30  1:07:11

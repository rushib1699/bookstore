-- MySQL dump 10.13  Distrib 8.1.0, for macos13 (arm64)
--
-- Host: localhost    Database: OnlineBookstore
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Authors`
--

DROP TABLE IF EXISTS `Authors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Authors` (
  `AuthorID` int NOT NULL AUTO_INCREMENT,
  `AuthorName` varchar(100) NOT NULL,
  PRIMARY KEY (`AuthorID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Authors`
--

LOCK TABLES `Authors` WRITE;
/*!40000 ALTER TABLE `Authors` DISABLE KEYS */;
INSERT INTO `Authors` VALUES (1,'Rushi');
/*!40000 ALTER TABLE `Authors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Books`
--

DROP TABLE IF EXISTS `Books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Books` (
  `BookID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) NOT NULL,
  `AuthorID` int DEFAULT NULL,
  `GenreID` int DEFAULT NULL,
  `PublishDate` date DEFAULT NULL,
  `Price` decimal(10,2) NOT NULL,
  `StockQuantity` int NOT NULL,
  `tumbnail_url` varchar(700) DEFAULT NULL,
  PRIMARY KEY (`BookID`),
  KEY `AuthorID` (`AuthorID`),
  KEY `GenreID` (`GenreID`),
  CONSTRAINT `Books_ibfk_1` FOREIGN KEY (`AuthorID`) REFERENCES `Authors` (`AuthorID`),
  CONSTRAINT `Books_ibfk_2` FOREIGN KEY (`GenreID`) REFERENCES `Genres` (`GenreID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Books`
--

LOCK TABLES `Books` WRITE;
/*!40000 ALTER TABLE `Books` DISABLE KEYS */;
INSERT INTO `Books` VALUES (1,'test',1,1,'2022-12-22',10.30,2,'https://bookstoreimages.s3.amazonaws.com/us-master-btg_2023_3d_d9l84sseh7otxfwk.png'),(2,'test2',1,1,'2022-12-22',13.00,4,'https://rbedagkabucket.blob.core.windows.net/bookstore/$abc-overflowing-bookcases.jpg'),(3,'bookAzure',1,1,'2023-12-24',15.00,20,'https://rbedagkabucket.blob.core.windows.net/bookstore/bookAzure-undefined-book_1.jpeg'),(4,'testend',1,1,'2023-12-22',12.00,45,'https://rbedagkabucket.blob.core.windows.net/bookstore/testend-1-book_2.jpeg'),(5,'testNot',1,1,'2023-12-15',234.00,234423,'https://rbedagkabucket.blob.core.windows.net/bookstore/testNot-1-book_3.jpeg'),(6,'testSuccess',1,1,'2023-12-07',12.00,34234,'https://rbedagkabucket.blob.core.windows.net/bookstore/testSuccess-1-book_3.jpeg');
/*!40000 ALTER TABLE `Books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `date` datetime DEFAULT NULL,
  `is_Active` tinyint NOT NULL DEFAULT '1',
  `is_Deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `NewTable_FK` (`user_id`),
  KEY `NewTable_FK_1` (`book_id`),
  CONSTRAINT `NewTable_FK` FOREIGN KEY (`user_id`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `NewTable_FK_1` FOREIGN KEY (`book_id`) REFERENCES `Books` (`BookID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,72,1,'2023-12-03 16:45:12',0,0),(2,72,1,'2023-12-03 16:46:56',0,0),(3,72,2,'2023-12-03 16:47:01',0,0),(4,72,1,'2023-12-03 17:19:56',0,0),(5,72,2,'2023-12-03 17:20:14',0,0),(6,72,1,'2023-12-03 17:28:23',0,0),(7,72,1,'2023-12-03 17:28:29',0,0),(8,72,2,'2023-12-03 17:28:31',0,0),(9,72,1,'2023-12-03 17:29:33',0,1),(10,72,2,'2023-12-03 17:29:34',0,1),(11,72,1,'2023-12-03 17:30:31',0,1),(12,72,1,'2023-12-03 17:42:40',0,1),(13,72,2,'2023-12-03 17:42:41',0,1),(14,72,1,'2023-12-03 20:19:33',0,1),(15,72,1,'2023-12-03 21:36:03',0,1),(16,72,2,'2023-12-03 21:36:05',0,1),(17,72,2,'2023-12-04 10:13:04',0,1),(18,72,3,'2023-12-04 10:29:32',0,1),(19,72,2,'2023-12-04 10:29:33',0,1),(20,72,1,'2023-12-04 10:29:34',0,1),(21,72,6,'2023-12-04 11:08:11',0,1),(22,72,4,'2023-12-04 11:08:13',0,1);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Genres`
--

DROP TABLE IF EXISTS `Genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Genres` (
  `GenreID` int NOT NULL AUTO_INCREMENT,
  `GenreName` varchar(50) NOT NULL,
  PRIMARY KEY (`GenreID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Genres`
--

LOCK TABLES `Genres` WRITE;
/*!40000 ALTER TABLE `Genres` DISABLE KEYS */;
INSERT INTO `Genres` VALUES (1,'drama');
/*!40000 ALTER TABLE `Genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchaseHistory`
--

DROP TABLE IF EXISTS `purchaseHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchaseHistory` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `BookId` int NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `isPaid` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`Id`),
  KEY `purchaseHistory_FK` (`userId`),
  KEY `purchaseHistory_FK_1` (`BookId`),
  CONSTRAINT `purchaseHistory_FK` FOREIGN KEY (`userId`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `purchaseHistory_FK_1` FOREIGN KEY (`BookId`) REFERENCES `Books` (`BookID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchaseHistory`
--

LOCK TABLES `purchaseHistory` WRITE;
/*!40000 ALTER TABLE `purchaseHistory` DISABLE KEYS */;
INSERT INTO `purchaseHistory` VALUES (1,72,2,'2023-12-03 20:14:51',1),(2,72,2,'2023-12-03 20:16:51',1),(3,72,2,'2023-12-03 20:18:15',1),(4,72,2,'2023-12-03 20:18:45',1),(5,72,2,'2023-12-03 20:19:20',1),(6,72,1,'2023-12-03 20:20:17',1),(7,72,1,'2023-12-03 21:36:08',1),(8,72,2,'2023-12-03 21:36:08',1),(9,72,2,'2023-12-04 10:13:16',1),(10,72,1,'2023-12-04 10:29:36',1),(11,72,2,'2023-12-04 10:29:39',1),(12,72,3,'2023-12-04 10:29:39',1),(13,72,4,'2023-12-04 11:08:15',1),(14,72,6,'2023-12-04 11:08:15',1);
/*!40000 ALTER TABLE `purchaseHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Rentals`
--

DROP TABLE IF EXISTS `Rentals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rentals` (
  `RentalID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `BookID` int DEFAULT NULL,
  `RentDate` date NOT NULL,
  `ReturnDate` date DEFAULT NULL,
  PRIMARY KEY (`RentalID`),
  KEY `UserID` (`UserID`),
  KEY `BookID` (`BookID`),
  CONSTRAINT `Rentals_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `Rentals_ibfk_2` FOREIGN KEY (`BookID`) REFERENCES `Books` (`BookID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rentals`
--

LOCK TABLES `Rentals` WRITE;
/*!40000 ALTER TABLE `Rentals` DISABLE KEYS */;
/*!40000 ALTER TABLE `Rentals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(100) DEFAULT NULL,
  `isAcrive` tinyint(1) NOT NULL DEFAULT '1',
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_UN` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
INSERT INTO `Roles` VALUES (1,'User',1,0);
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Transactions`
--

DROP TABLE IF EXISTS `Transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Transactions` (
  `TransactionID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `TotalAmount` decimal(10,2) NOT NULL,
  `TransactionDate` datetime NOT NULL,
  PRIMARY KEY (`TransactionID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Transactions_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Transactions`
--

LOCK TABLES `Transactions` WRITE;
/*!40000 ALTER TABLE `Transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `Transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(600) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `RoleID` int NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `Email` (`Email`),
  KEY `Users_FK` (`RoleID`),
  CONSTRAINT `Users_FK` FOREIGN KEY (`RoleID`) REFERENCES `Roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (72,'Rushi','$2b$10$ygqfLeW1yG5PqM5YonAOtuZthKH7boT4xwlT4X2gDo/34DRdiIkEe','ra.bedagkar@gmail.com',NULL,1,0,1);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'OnlineBookstore'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-05 11:03:29

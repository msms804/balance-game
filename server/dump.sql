-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: balance_game_db
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `BalanceGamePost`
--

DROP TABLE IF EXISTS `BalanceGamePost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BalanceGamePost` (
  `post_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `main_title` varchar(255) NOT NULL,
  `title1` varchar(255) NOT NULL,
  `title2` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  KEY `balancegamepost_ibfk_1` (`user_id`),
  CONSTRAINT `balancegamepost_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BalanceGamePost`
--

LOCK TABLES `BalanceGamePost` WRITE;
/*!40000 ALTER TABLE `BalanceGamePost` DISABLE KEYS */;
INSERT INTO `BalanceGamePost` VALUES (9,5,'누가 더 이뻐?','이청아','박지현','2025-06-16 23:06:14'),(11,5,'누가 더 멋져','정승민','장지민','2025-06-17 04:14:00'),(12,5,'뭐가 더 좋은가요','겨울','여름','2025-06-17 11:07:32'),(13,5,'뭐가 더 싫은가요','겨울','여름','2025-06-17 11:14:53'),(14,14,'username이 들어가나요?','예','아니오','2025-06-17 13:31:01');
/*!40000 ALTER TABLE `BalanceGamePost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comment` (
  `comment_id` bigint NOT NULL AUTO_INCREMENT,
  `post_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `comment` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `BalanceGamePost` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
INSERT INTO `Comment` VALUES (4,9,5,'??? 대지현임','2025-06-17 01:28:43'),(5,9,5,'이청아 존예긴 해','2025-06-17 01:30:55'),(7,9,5,'고윤정','2025-06-17 11:17:30'),(8,9,14,'나도 고윤정이 더 좋아','2025-06-17 14:06:53');
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `login_id` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `login_id` (`login_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'zero','1234','빛나는 호랑이'),(5,'testuser','$2b$10$HrLYIQvrg1UA4II835SNW.xUaJ05Wsv02Qm8h/xl3IrKT.Cume2G6',NULL),(6,'testuser2','$2b$10$nKVkVdPlju1NAYk1o.o.qek1bzHcHxVmO1KkPo4Pbnu6fni9TZ3NO',NULL),(7,'testuser3','$2b$10$9DTMtB3zMYWNUxl5hsCqAepyEL0isVTWNcZRTy.uV8kPmWmcCQNRO',NULL),(8,'testuser4','$2b$10$yfh2Svpr7DFi7dPGE4f7RuxjO7FxCvjeWcQ8/UP2OnoQm8xiM.6.i','배고픈강아지623'),(9,'testuser5','$2b$10$Uym4M41IxfJ6YwfksfGDa.wL9SAx./wHQjMTIq87gF1Or6tvh/TUS','귀여운곰182'),(10,'testuser6','$2b$10$3q2j7wrw.f3LwHgahuFkLukw2KL7hnKoqAEGSvV55AvpIwKly5wuG','배고픈 여우857'),(11,'testuser7','$2b$10$l1VMNLC/9900D7U6lj0M9.Nno77HY.15WdEcQz3jCRw2ji6CAdrfS','졸린-강아지142'),(12,'testuser9','$2b$10$g0fx6v6oLY72EkieWBqY7eKycFW/q/shf1DdrEqGy99cNV5/SCXOO','멋진-강아지398'),(13,'testuser12','$2b$10$iee04CGEo6KDjctf0074Q.xzqVB3rVO2wMEV4u6mJ0FxmnBsrPCIu','배고픈-여우289'),(14,'testuser13','$2b$10$x/KSuuMjJyrkKWfHLHDow.3KNkh21TEV4PhDyXc9Jdlt82fcDgxJW','귀여운-강아지73'),(15,'testuser14','$2b$10$/Px5TXSBxpJ7qHOwosvVOe5jXCVYW3GFd0RCtrjMU7aBMREs8TtnS','빠른-여우687');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Vote`
--

DROP TABLE IF EXISTS `Vote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Vote` (
  `vote_id` bigint NOT NULL AUTO_INCREMENT,
  `post_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `choice` enum('msg1','msg2') NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`vote_id`),
  UNIQUE KEY `unique_vote` (`user_id`,`post_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `vote_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `BalanceGamePost` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `vote_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Vote`
--

LOCK TABLES `Vote` WRITE;
/*!40000 ALTER TABLE `Vote` DISABLE KEYS */;
INSERT INTO `Vote` VALUES (3,9,5,'msg1','2025-06-16 23:17:41'),(4,9,14,'msg2','2025-06-17 11:22:10');
/*!40000 ALTER TABLE `Vote` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-17 23:32:59

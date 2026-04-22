/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `Reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `rating` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `Reviews_productId_idx` (`productId`),
  UNIQUE KEY `Reviews_userId_productId_key` (`userId`,`productId`),
  CONSTRAINT `Reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Reviews_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=330001;

/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `CompareItems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `CompareItems_userId_idx` (`userId`),
  UNIQUE KEY `CompareItems_userId_productId_key` (`userId`,`productId`),
  KEY `CompareItems_productId_fkey` (`productId`),
  CONSTRAINT `CompareItems_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `CompareItems_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=450001;

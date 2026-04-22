/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `RecentlyViewed` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `viewedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `RecentlyViewed_userId_viewedAt_idx` (`userId`,`viewedAt`),
  UNIQUE KEY `RecentlyViewed_userId_productId_key` (`userId`,`productId`),
  KEY `RecentlyViewed_productId_fkey` (`productId`),
  CONSTRAINT `RecentlyViewed_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `RecentlyViewed_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=900001;

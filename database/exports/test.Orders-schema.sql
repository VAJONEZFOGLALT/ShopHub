/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `Orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `totalPrice` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` enum('PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `courier` enum('UPS','PACKETA','DPD','INPOST') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UPS',
  `shippingAddress` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trackingNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `teljesitve` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `Orders_userId_idx` (`userId`),
  KEY `Orders_createdAt_idx` (`createdAt`),
  CONSTRAINT `Orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=810001;

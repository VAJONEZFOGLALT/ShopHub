/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `OrderItems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `OrderItems_orderId_idx` (`orderId`),
  KEY `OrderItems_productId_idx` (`productId`),
  CONSTRAINT `OrderItems_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `OrderItems_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=810001;

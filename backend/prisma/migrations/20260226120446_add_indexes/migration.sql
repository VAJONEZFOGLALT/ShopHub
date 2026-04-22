-- CreateIndex
CREATE INDEX `Orders_createdAt_idx` ON `Orders`(`createdAt`);

-- CreateIndex
CREATE INDEX `Products_category_idx` ON `Products`(`category`);

-- RenameIndex
ALTER TABLE `OrderItems` RENAME INDEX `OrderItems_orderId_fkey` TO `OrderItems_orderId_idx`;

-- RenameIndex
ALTER TABLE `OrderItems` RENAME INDEX `OrderItems_productId_fkey` TO `OrderItems_productId_idx`;

-- RenameIndex
ALTER TABLE `Orders` RENAME INDEX `Orders_userId_fkey` TO `Orders_userId_idx`;

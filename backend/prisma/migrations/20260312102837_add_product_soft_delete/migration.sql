-- AlterTable
ALTER TABLE `Products` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `Products_deletedAt_idx` ON `Products`(`deletedAt`);

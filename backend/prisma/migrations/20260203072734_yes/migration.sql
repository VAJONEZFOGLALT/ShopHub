/*
  Warnings:

  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wishlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `Reviews_productId_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `Reviews_userId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlist` DROP FOREIGN KEY `Wishlist_productId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlist` DROP FOREIGN KEY `Wishlist_userId_fkey`;

-- DropTable
DROP TABLE `reviews`;

-- DropTable
DROP TABLE `wishlist`;

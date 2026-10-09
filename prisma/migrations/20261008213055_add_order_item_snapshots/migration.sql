/*
  Warnings:

  - Added the required column `product_name` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "product_emoji" TEXT,
ADD COLUMN     "product_image" TEXT,
ADD COLUMN     "product_name" TEXT NOT NULL;

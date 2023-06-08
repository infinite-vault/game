/*
  Warnings:

  - Added the required column `background` to the `Tile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tile" ADD COLUMN     "background" TEXT NOT NULL;

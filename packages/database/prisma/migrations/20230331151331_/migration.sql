/*
  Warnings:

  - You are about to drop the column `status` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `x` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `Character` table. All the data in the column will be lost.
  - The `nextAction` column on the `Character` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `enemyId` on the `Stats` table. All the data in the column will be lost.
  - You are about to drop the column `enemyId` on the `Tile` table. All the data in the column will be lost.
  - The `type` column on the `Tile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Enemy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Fight` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `avatar` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tileId` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agility` to the `Stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `luck` to the `Stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stealth` to the `Stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vision` to the `Stats` table without a default value. This is not possible if the table is not empty.
  - Made the column `gameId` on table `Tile` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('ATTACK', 'DEFEND');

-- CreateEnum
CREATE TYPE "TileType" AS ENUM ('START', 'ENEMY', 'DEFEATED', 'PORTAL', 'BOSS', 'SHOP', 'TREASURE', 'TRAP', 'EMPTY');

-- CreateEnum
CREATE TYPE "CharacterNextAction" AS ENUM ('MOVE', 'ATTACK', 'DEFEATED', 'USE_ITEM', 'USE_SKILL');

-- CreateEnum
CREATE TYPE "CharacterConnection" AS ENUM ('ONLINE', 'OFFLINE', 'AFK');

-- DropForeignKey
ALTER TABLE "Fight" DROP CONSTRAINT "Fight_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Fight" DROP CONSTRAINT "Fight_enemyId_fkey";

-- DropForeignKey
ALTER TABLE "Fight" DROP CONSTRAINT "Fight_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Fight" DROP CONSTRAINT "Fight_tileId_fkey";

-- DropForeignKey
ALTER TABLE "Stats" DROP CONSTRAINT "Stats_enemyId_fkey";

-- DropForeignKey
ALTER TABLE "Tile" DROP CONSTRAINT "Tile_enemyId_fkey";

-- DropForeignKey
ALTER TABLE "Tile" DROP CONSTRAINT "Tile_gameId_fkey";

-- DropIndex
DROP INDEX "Stats_enemyId_key";

-- DropIndex
DROP INDEX "Tile_enemyId_key";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "status",
DROP COLUMN "x",
DROP COLUMN "y",
ADD COLUMN     "actionId" INTEGER,
ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "connection" "CharacterConnection" NOT NULL DEFAULT 'OFFLINE',
ADD COLUMN     "isDefeated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNpc" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tileId" INTEGER NOT NULL,
DROP COLUMN "nextAction",
ADD COLUMN     "nextAction" "CharacterNextAction" NOT NULL DEFAULT 'MOVE';

-- AlterTable
ALTER TABLE "Stats" DROP COLUMN "enemyId",
ADD COLUMN     "agility" INTEGER NOT NULL,
ADD COLUMN     "luck" INTEGER NOT NULL,
ADD COLUMN     "stealth" INTEGER NOT NULL,
ADD COLUMN     "vision" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tile" DROP COLUMN "enemyId",
ALTER COLUMN "gameId" SET NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "TileType" NOT NULL DEFAULT 'EMPTY';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email";

-- DropTable
DROP TABLE "Enemy";

-- DropTable
DROP TABLE "Fight";

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "gameId" TEXT NOT NULL,
    "type" "ActionType" NOT NULL,
    "round" JSONB NOT NULL DEFAULT '{}',
    "diff" JSONB NOT NULL DEFAULT '{}',
    "history" JSONB NOT NULL DEFAULT '[]',
    "isOver" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "tileId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tile" ADD CONSTRAINT "Tile_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

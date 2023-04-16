/*
  Warnings:

  - You are about to drop the column `nextAction` on the `Character` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ActionType" ADD VALUE 'FIGHT';

-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_userId_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "nextAction",
ALTER COLUMN "userId" DROP NOT NULL;

-- DropEnum
DROP TYPE "CharacterNextAction";

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

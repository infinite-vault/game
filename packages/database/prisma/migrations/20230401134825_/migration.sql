-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_tileId_fkey";

-- AlterTable
ALTER TABLE "Character" ALTER COLUMN "tileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

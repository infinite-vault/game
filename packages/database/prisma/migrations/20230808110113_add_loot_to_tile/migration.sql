-- AlterTable
ALTER TABLE "Loot" ADD COLUMN     "tileId" INTEGER;

-- AddForeignKey
ALTER TABLE "Loot" ADD CONSTRAINT "Loot_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterEnum
ALTER TYPE "ActionType" ADD VALUE 'QUEUED';

-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "executionTime" TIMESTAMP(3);

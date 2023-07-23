/*
  Warnings:

  - The values [QUEUED] on the enum `ActionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `executionTime` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `isOver` on the `Action` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActionType_new" AS ENUM ('PENDING', 'DRAMA', 'OVER');
ALTER TABLE "Action" ALTER COLUMN "type" TYPE "ActionType_new" USING ("type"::text::"ActionType_new");
ALTER TYPE "ActionType" RENAME TO "ActionType_old";
ALTER TYPE "ActionType_new" RENAME TO "ActionType";
DROP TYPE "ActionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "executionTime",
DROP COLUMN "isDeleted",
DROP COLUMN "isOver";

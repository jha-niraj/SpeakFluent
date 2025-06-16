/*
  Warnings:

  - The `selectedLevel` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SelectedLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 0,
DROP COLUMN "selectedLevel",
ADD COLUMN     "selectedLevel" "SelectedLevel" DEFAULT 'BEGINNER';

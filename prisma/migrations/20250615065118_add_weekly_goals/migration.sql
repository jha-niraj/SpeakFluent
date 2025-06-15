-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('PRESET', 'CUSTOM');

-- AlterTable
ALTER TABLE "CreditTransaction" ALTER COLUMN "currency" SET DEFAULT 'USD';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 300;

-- CreateTable
CREATE TABLE "WeeklyGoal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "GoalType" NOT NULL DEFAULT 'CUSTOM',
    "category" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyGoal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WeeklyGoal_userId_idx" ON "WeeklyGoal"("userId");

-- CreateIndex
CREATE INDEX "WeeklyGoal_type_idx" ON "WeeklyGoal"("type");

-- CreateIndex
CREATE INDEX "WeeklyGoal_category_idx" ON "WeeklyGoal"("category");

-- AddForeignKey
ALTER TABLE "WeeklyGoal" ADD CONSTRAINT "WeeklyGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

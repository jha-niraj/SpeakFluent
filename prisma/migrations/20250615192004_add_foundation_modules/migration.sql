-- CreateEnum
CREATE TYPE "ModuleType" AS ENUM ('SCRIPT_WRITING', 'PHONETICS_PRONUNCIATION', 'VOCABULARY_BUILDING', 'GRAMMAR_FUNDAMENTALS', 'CULTURAL_CONTEXT');

-- CreateEnum
CREATE TYPE "ModuleStatus" AS ENUM ('LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "QuizType" AS ENUM ('MULTIPLE_CHOICE', 'FILL_IN_BLANK', 'PRONUNCIATION', 'MATCHING', 'WRITING_PRACTICE');

-- CreateEnum
CREATE TYPE "FeatureAccessLevel" AS ENUM ('FOUNDATION_REQUIRED', 'INTERMEDIATE_REQUIRED', 'ADVANCED_ACCESS', 'FULL_ACCESS');

-- CreateTable
CREATE TABLE "FoundationModule" (
    "id" TEXT NOT NULL,
    "moduleType" "ModuleType" NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "requiredScore" INTEGER NOT NULL DEFAULT 75,
    "creditsReward" INTEGER NOT NULL DEFAULT 50,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoundationModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "status" "ModuleStatus" NOT NULL DEFAULT 'LOCKED',
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "currentSection" TEXT,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "bestScore" INTEGER,
    "completedAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "quizType" "QuizType" NOT NULL,
    "score" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFeatureAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "featureName" TEXT NOT NULL,
    "accessLevel" "FeatureAccessLevel" NOT NULL,
    "unlockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFeatureAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FoundationModule_language_idx" ON "FoundationModule"("language");

-- CreateIndex
CREATE INDEX "FoundationModule_orderIndex_idx" ON "FoundationModule"("orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "FoundationModule_moduleType_language_key" ON "FoundationModule"("moduleType", "language");

-- CreateIndex
CREATE INDEX "ModuleProgress_userId_idx" ON "ModuleProgress"("userId");

-- CreateIndex
CREATE INDEX "ModuleProgress_language_idx" ON "ModuleProgress"("language");

-- CreateIndex
CREATE INDEX "ModuleProgress_status_idx" ON "ModuleProgress"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleProgress_userId_moduleId_key" ON "ModuleProgress"("userId", "moduleId");

-- CreateIndex
CREATE INDEX "QuizAttempt_userId_idx" ON "QuizAttempt"("userId");

-- CreateIndex
CREATE INDEX "QuizAttempt_moduleId_idx" ON "QuizAttempt"("moduleId");

-- CreateIndex
CREATE INDEX "QuizAttempt_language_idx" ON "QuizAttempt"("language");

-- CreateIndex
CREATE INDEX "QuizAttempt_passed_idx" ON "QuizAttempt"("passed");

-- CreateIndex
CREATE INDEX "UserFeatureAccess_userId_idx" ON "UserFeatureAccess"("userId");

-- CreateIndex
CREATE INDEX "UserFeatureAccess_language_idx" ON "UserFeatureAccess"("language");

-- CreateIndex
CREATE UNIQUE INDEX "UserFeatureAccess_userId_language_featureName_key" ON "UserFeatureAccess"("userId", "language", "featureName");

-- AddForeignKey
ALTER TABLE "ModuleProgress" ADD CONSTRAINT "ModuleProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleProgress" ADD CONSTRAINT "ModuleProgress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "FoundationModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "FoundationModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

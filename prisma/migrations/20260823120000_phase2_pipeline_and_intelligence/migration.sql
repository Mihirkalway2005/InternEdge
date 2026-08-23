-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('in_progress', 'completed', 'abandoned');

-- CreateEnum
CREATE TYPE "ResumeStatus" AS ENUM ('uploaded', 'parsed', 'analyzed', 'failed');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'application';

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "statusUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "internships" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'seed',
ADD COLUMN     "stipendMax" INTEGER,
ADD COLUMN     "stipendMin" INTEGER;

-- AlterTable
ALTER TABLE "interviews" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "currentQuestionIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "durationSec" INTEGER,
ADD COLUMN     "roleContext" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "InterviewStatus" NOT NULL DEFAULT 'in_progress',
ALTER COLUMN "score" DROP NOT NULL,
ALTER COLUMN "feedback" DROP NOT NULL;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "dedupeKey" TEXT,
ADD COLUMN     "link" TEXT;

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "onboardedAt" TIMESTAMP(3),
ADD COLUMN     "preferredLocations" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "preferredWorkType" "WorkType",
ADD COLUMN     "targetRole" TEXT,
ADD COLUMN     "targetRoles" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "resumes" ADD COLUMN     "analysis" JSONB,
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "sizeBytes" INTEGER,
ADD COLUMN     "status" "ResumeStatus" NOT NULL DEFAULT 'uploaded',
ADD COLUMN     "statusMessage" TEXT,
ADD COLUMN     "storageKey" TEXT,
ADD COLUMN     "structured" JSONB;

-- AlterTable
ALTER TABLE "roadmap_tasks" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "resourceUrl" TEXT,
ADD COLUMN     "skillName" TEXT;

-- AlterTable
ALTER TABLE "roadmaps" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "application_events" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "fromStatus" "ApplicationStatus",
    "toStatus" "ApplicationStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "readiness_snapshots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "components" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "readiness_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolios" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "headline" TEXT,
    "bio" TEXT,
    "data" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assistant_messages" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assistant_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "application_events_applicationId_idx" ON "application_events"("applicationId");

-- CreateIndex
CREATE INDEX "application_events_createdAt_idx" ON "application_events"("createdAt");

-- CreateIndex
CREATE INDEX "readiness_snapshots_userId_createdAt_idx" ON "readiness_snapshots"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "portfolios_slug_key" ON "portfolios"("slug");

-- CreateIndex
CREATE INDEX "portfolios_userId_idx" ON "portfolios"("userId");

-- CreateIndex
CREATE INDEX "assistant_messages_userId_conversationId_createdAt_idx" ON "assistant_messages"("userId", "conversationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "applications_userId_internshipId_key" ON "applications"("userId", "internshipId");

-- CreateIndex
CREATE INDEX "internships_isActive_idx" ON "internships"("isActive");

-- CreateIndex
CREATE INDEX "interviews_status_idx" ON "interviews"("status");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_userId_dedupeKey_key" ON "notifications"("userId", "dedupeKey");

-- CreateIndex
CREATE UNIQUE INDEX "skills_userId_name_key" ON "skills"("userId", "name");

-- AddForeignKey
ALTER TABLE "application_events" ADD CONSTRAINT "application_events_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "readiness_snapshots" ADD CONSTRAINT "readiness_snapshots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assistant_messages" ADD CONSTRAINT "assistant_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- AlterTable
ALTER TABLE "User" ADD COLUMN     "anniversary" TIMESTAMP(3),
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "imagePublicId" TEXT,
ADD COLUMN     "joinedChurchDate" TIMESTAMP(3),
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "notificationPrefs" JSONB,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "privacySettings" JSONB,
ADD COLUMN     "theme" TEXT;

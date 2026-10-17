-- AlterTable: Make password_hash nullable to allow Google OAuth users
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;
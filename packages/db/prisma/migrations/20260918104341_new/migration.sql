/*
  Warnings:

  - The values [ADMIN] on the enum `Designation` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterEnum
BEGIN;
CREATE TYPE "Designation_new" AS ENUM ('TEACHER', 'ACCOUNTANT', 'PRINCIPAL', 'CLERK', 'LIBRARIAN', 'OTHER');
ALTER TABLE "Employee" ALTER COLUMN "designation" TYPE "Designation_new" USING ("designation"::text::"Designation_new");
ALTER TYPE "Designation" RENAME TO "Designation_old";
ALTER TYPE "Designation_new" RENAME TO "Designation";
DROP TYPE "public"."Designation_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_owner_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

BEGIN;
-- Convert legacy constant generated columns to constrained defaults Prisma can model.
ALTER TABLE padi.profiles ALTER COLUMN course_kind DROP EXPRESSION;
ALTER TABLE padi.profiles ALTER COLUMN semester_kind DROP EXPRESSION;
ALTER TABLE padi.profiles ALTER COLUMN device_kind DROP EXPRESSION;
ALTER TABLE padi.profiles ALTER COLUMN internet_kind DROP EXPRESSION;
ALTER TABLE padi.profiles ALTER COLUMN help_kind DROP EXPRESSION;
/*
  Warnings:

  - Made the column `course_kind` on table `profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `semester_kind` on table `profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `device_kind` on table `profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `internet_kind` on table `profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `help_kind` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "padi"."profiles" ALTER COLUMN "course_kind" SET NOT NULL,
ALTER COLUMN "course_kind" SET DEFAULT 'course'::text,
ALTER COLUMN "semester_kind" SET NOT NULL,
ALTER COLUMN "semester_kind" SET DEFAULT 'semester'::text,
ALTER COLUMN "device_kind" SET NOT NULL,
ALTER COLUMN "device_kind" SET DEFAULT 'device'::text,
ALTER COLUMN "internet_kind" SET NOT NULL,
ALTER COLUMN "internet_kind" SET DEFAULT 'internet'::text,
ALTER COLUMN "help_kind" SET NOT NULL,
ALTER COLUMN "help_kind" SET DEFAULT 'help'::text;
ALTER TABLE padi.profiles ADD CONSTRAINT profiles_course_kind_check CHECK (course_kind = 'course');
ALTER TABLE padi.profiles ADD CONSTRAINT profiles_semester_kind_check CHECK (semester_kind = 'semester');
ALTER TABLE padi.profiles ADD CONSTRAINT profiles_device_kind_check CHECK (device_kind = 'device');
ALTER TABLE padi.profiles ADD CONSTRAINT profiles_internet_kind_check CHECK (internet_kind = 'internet');
ALTER TABLE padi.profiles ADD CONSTRAINT profiles_help_kind_check CHECK (help_kind = 'help');
COMMIT;

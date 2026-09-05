-- CreateEnum
CREATE TYPE "PhoneType" AS ENUM ('MOBILE', 'HOME', 'WORK');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "Designation" AS ENUM ('TEACHER', 'ACCOUNTANT', 'PRINCIPAL', 'ADMIN', 'CLERK', 'LIBRARIAN', 'OTHER');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "SchoolStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "StandardType" AS ENUM ('SCHOOL', 'BACHELORS', 'MASTERS', 'PHD');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'FACEBOOK', 'LINKEDIN', 'GITHUB', 'EMAIL');

-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ONGOING', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('SUBMITTED', 'GRADED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dob" DATE NOT NULL,
    "gender" "Gender" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "qualification" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhoneNumber" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "country_code" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "type" "PhoneType" NOT NULL DEFAULT 'MOBILE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhoneNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "device_token" TEXT,
    "ip_address" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_active" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT[],
    "phone" TEXT[],
    "address" TEXT NOT NULL,
    "status" "SchoolStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicYear" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" UUID NOT NULL,
    "employee_code" TEXT NOT NULL,
    "joining_date" TIMESTAMP(3) NOT NULL,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "designation" "Designation" NOT NULL,
    "user_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeExperience" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "organization" TEXT NOT NULL,
    "designation" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "description" TEXT,

    CONSTRAINT "EmployeeExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Standard" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "StandardType" NOT NULL,
    "level" INTEGER,
    "duration_years" INTEGER,
    "school_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Standard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" UUID NOT NULL,
    "standard_id" UUID NOT NULL,
    "section" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassTeacherAssignment" (
    "id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "teacher_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassTeacherAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandardSubject" (
    "id" UUID NOT NULL,
    "standard_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandardSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assignment_id" UUID NOT NULL,
    "questions" JSONB NOT NULL,
    "total_marks" INTEGER NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "status" "ExamStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamSubmission" (
    "id" UUID NOT NULL,
    "exam_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "answers" JSONB NOT NULL,
    "score" DOUBLE PRECISION,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "graded_by_teacher_id" UUID,
    "graded_at" TIMESTAMP(3),

    CONSTRAINT "ExamSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectTeacherAssignment" (
    "id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "standard_subject_id" UUID NOT NULL,
    "teacher_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectTeacherAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" UUID NOT NULL,
    "assignment_id" UUID NOT NULL,
    "day" "WeekDay" NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "classTeacherAssignmentId" UUID,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salary" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "current_salary" DECIMAL(12,2) NOT NULL,
    "initial_salary" DECIMAL(12,2) NOT NULL,
    "hike" DOUBLE PRECISION NOT NULL,
    "bank_name" TEXT,
    "account_number" TEXT,
    "ifsc_code" TEXT,
    "bank_branch" TEXT,
    "upi_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "PhoneNumber_user_id_idx" ON "PhoneNumber"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refresh_token_key" ON "Session"("refresh_token");

-- CreateIndex
CREATE INDEX "Session_user_id_idx" ON "Session"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug");

-- CreateIndex
CREATE INDEX "AcademicYear_school_id_idx" ON "AcademicYear"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicYear_school_id_name_key" ON "AcademicYear"("school_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employee_code_key" ON "Employee"("employee_code");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_user_id_key" ON "Employee"("user_id");

-- CreateIndex
CREATE INDEX "Employee_school_id_idx" ON "Employee"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_employee_id_key" ON "Teacher"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_user_id_key" ON "Student"("user_id");

-- CreateIndex
CREATE INDEX "EmployeeExperience_employee_id_idx" ON "EmployeeExperience"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "Class_standard_id_section_key" ON "Class"("standard_id", "section");

-- CreateIndex
CREATE INDEX "ClassTeacherAssignment_teacher_id_idx" ON "ClassTeacherAssignment"("teacher_id");

-- CreateIndex
CREATE INDEX "ClassTeacherAssignment_academic_year_id_idx" ON "ClassTeacherAssignment"("academic_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClassTeacherAssignment_class_id_academic_year_id_key" ON "ClassTeacherAssignment"("class_id", "academic_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");

-- CreateIndex
CREATE UNIQUE INDEX "StandardSubject_standard_id_subject_id_key" ON "StandardSubject"("standard_id", "subject_id");

-- CreateIndex
CREATE INDEX "Exam_assignment_id_idx" ON "Exam"("assignment_id");

-- CreateIndex
CREATE INDEX "ExamSubmission_exam_id_idx" ON "ExamSubmission"("exam_id");

-- CreateIndex
CREATE INDEX "ExamSubmission_student_id_idx" ON "ExamSubmission"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "ExamSubmission_exam_id_student_id_key" ON "ExamSubmission"("exam_id", "student_id");

-- CreateIndex
CREATE INDEX "SubjectTeacherAssignment_teacher_id_idx" ON "SubjectTeacherAssignment"("teacher_id");

-- CreateIndex
CREATE INDEX "SubjectTeacherAssignment_academic_year_id_idx" ON "SubjectTeacherAssignment"("academic_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectTeacherAssignment_class_id_standard_subject_id_teach_key" ON "SubjectTeacherAssignment"("class_id", "standard_subject_id", "teacher_id", "academic_year_id");

-- CreateIndex
CREATE INDEX "Schedule_assignment_id_idx" ON "Schedule"("assignment_id");

-- CreateIndex
CREATE INDEX "Schedule_day_idx" ON "Schedule"("day");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_assignment_id_day_start_time_key" ON "Schedule"("assignment_id", "day", "start_time");

-- CreateIndex
CREATE UNIQUE INDEX "Salary_employee_id_key" ON "Salary"("employee_id");

-- AddForeignKey
ALTER TABLE "PhoneNumber" ADD CONSTRAINT "PhoneNumber_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicYear" ADD CONSTRAINT "AcademicYear_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeExperience" ADD CONSTRAINT "EmployeeExperience_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Standard" ADD CONSTRAINT "Standard_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_standard_id_fkey" FOREIGN KEY ("standard_id") REFERENCES "Standard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassTeacherAssignment" ADD CONSTRAINT "ClassTeacherAssignment_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassTeacherAssignment" ADD CONSTRAINT "ClassTeacherAssignment_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassTeacherAssignment" ADD CONSTRAINT "ClassTeacherAssignment_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardSubject" ADD CONSTRAINT "StandardSubject_standard_id_fkey" FOREIGN KEY ("standard_id") REFERENCES "Standard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardSubject" ADD CONSTRAINT "StandardSubject_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "SubjectTeacherAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubmission" ADD CONSTRAINT "ExamSubmission_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubmission" ADD CONSTRAINT "ExamSubmission_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubmission" ADD CONSTRAINT "ExamSubmission_graded_by_teacher_id_fkey" FOREIGN KEY ("graded_by_teacher_id") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectTeacherAssignment" ADD CONSTRAINT "SubjectTeacherAssignment_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectTeacherAssignment" ADD CONSTRAINT "SubjectTeacherAssignment_standard_subject_id_fkey" FOREIGN KEY ("standard_subject_id") REFERENCES "StandardSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectTeacherAssignment" ADD CONSTRAINT "SubjectTeacherAssignment_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectTeacherAssignment" ADD CONSTRAINT "SubjectTeacherAssignment_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "SubjectTeacherAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_classTeacherAssignmentId_fkey" FOREIGN KEY ("classTeacherAssignmentId") REFERENCES "ClassTeacherAssignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

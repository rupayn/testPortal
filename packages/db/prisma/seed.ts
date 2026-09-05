import { logger } from "@repo/logger/config";
import { prismaSingleton } from "../src/index.js";
import {
  Gender,
  PhoneType,
  UserStatus,
  WeekDay,
  Designation,
  EmployeeStatus,
  SchoolStatus,
  StandardType,
  AuthProvider,
  ExamStatus,
  SubmissionStatus,
} from "../generated/prisma/enums.ts";
import { hashPassword } from "@repo/miscellaneous/backend";
const password = "Password@1234";
const mathExamQuestions = [
  {
    id: 1,
    question: "Solve for x: 2x + 3 = 11",
    type: "MCQ",
    options: [
      { key: "A", text: "x = 3" },
      { key: "B", text: "x = 4" },
      { key: "C", text: "x = 5" },
      { key: "D", text: "x = 7" },
    ],
    correct_option: "B",
    positive_marks: 4,
    negative_marks: -1,
  },
  {
    id: 2,
    question: "Simplify: 3(x + 2) - 4x",
    type: "MCQ",
    options: [
      { key: "A", text: "-x + 6" },
      { key: "B", text: "x + 6" },
      { key: "C", text: "-x - 6" },
      { key: "D", text: "7x + 6" },
    ],
    correct_option: "A",
    positive_marks: 4,
    negative_marks: -1,
  },
  {
    id: 3,
    question: "What is the value of x if 5x - 10 = 0?",
    type: "MCQ",
    options: [
      { key: "A", text: "x = 0" },
      { key: "B", text: "x = 1" },
      { key: "C", text: "x = 2" },
      { key: "D", text: "x = 5" },
    ],
    correct_option: "C",
    positive_marks: 4,
    negative_marks: -1,
  },
  {
    id: 4,
    question: "Which of the following is a linear equation?",
    type: "MCQ",
    options: [
      { key: "A", text: "x^2 + 1 = 0" },
      { key: "B", text: "2x + 5 = 0" },
      { key: "C", text: "1/x = 4" },
      { key: "D", text: "x^3 = 8" },
    ],
    correct_option: "B",
    positive_marks: 4,
    negative_marks: -1,
  },
  {
    id: 5,
    question: "If 4x = 20, what is x?",
    type: "MCQ",
    options: [
      { key: "A", text: "x = 4" },
      { key: "B", text: "x = 5" },
      { key: "C", text: "x = 16" },
      { key: "D", text: "x = 80" },
    ],
    correct_option: "B",
    positive_marks: 4,
    negative_marks: -1,
  },
];

const mathExamTotalMarks = mathExamQuestions.reduce((sum, q) => sum + q.positive_marks, 0);

interface McqQuestion {
  id: number;
  question: string;
  type: string;
  options: { key: string; text: string }[];
  correct_option: string;
  positive_marks: number;
  negative_marks: number;
}

function buildMcqAnswers(
  myMathExamQuestions: McqQuestion[],
  selections: Record<number, string | null>
) {
  return myMathExamQuestions.map((q) => {
    const selected_option = selections[q.id] ?? null;
    const is_correct = selected_option === q.correct_option;
    const marks_awarded =
      selected_option === null ? 0 : is_correct ? q.positive_marks : q.negative_marks;

    return {
      question_id: q.id,
      selected_option,
      is_correct: selected_option === null ? null : is_correct,
      marks_awarded,
    };
  });
}

function totalScore(answers: ReturnType<typeof buildMcqAnswers>) {
  return answers.reduce((sum, a) => sum + a.marks_awarded, 0);
}

function time(hhmm: string): Date {
  // Prisma @db.Time() columns just need a Date whose time-of-day is used.
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(Date.UTC(1970, 0, 1, h, m, 0));
}

async function main() {
  logger.info("Seeding database...");
  const hashedPassword = await hashPassword(password);
  // ============================================================
  // SCHOOL
  // ============================================================
  const school = await prismaSingleton.school.create({
    data: {
      name: "Greenwood High School",
      slug: "greenwood-high",
      email: ["contact@greenwoodhigh.edu"],
      phone: ["+911234567890"],
      address: "123 Greenwood Avenue, Springfield",
      status: SchoolStatus.ACTIVE,
    },
  });

  // ============================================================
  // ACADEMIC YEAR
  // ============================================================
  const academicYear = await prismaSingleton.academicYear.create({
    data: {
      school_id: school.id,
      name: "2025-2026",
      start_date: new Date("2025-06-01"),
      end_date: new Date("2026-04-30"),
      is_current: true,
    },
  });

  // ============================================================
  // STANDARD (Grade 10) + CLASS (10-A)
  // ============================================================
  const standard = await prismaSingleton.standard.create({
    data: {
      name: "Grade 10",
      type: StandardType.SCHOOL,
      level: 10,
      school_id: school.id,
    },
  });

  const classA = await prismaSingleton.class.create({
    data: {
      standard_id: standard.id,
      section: "A",
    },
  });

  // ============================================================
  // SUBJECTS + STANDARD SUBJECTS
  // ============================================================
  const mathSubject = await prismaSingleton.subject.create({
    data: { name: "Mathematics", code: "MATH101" },
  });

  const scienceSubject = await prismaSingleton.subject.create({
    data: { name: "Science", code: "SCI101" },
  });

  const englishSubject = await prismaSingleton.subject.create({
    data: { name: "English", code: "ENG101" },
  });

  const mathStandardSubject = await prismaSingleton.standardSubject.create({
    data: { standard_id: standard.id, subject_id: mathSubject.id },
  });

  const scienceStandardSubject = await prismaSingleton.standardSubject.create({
    data: { standard_id: standard.id, subject_id: scienceSubject.id },
  });

  await prismaSingleton.standardSubject.create({
    data: { standard_id: standard.id, subject_id: englishSubject.id },
  });

  // ============================================================
  // USERS: ADMIN, PRINCIPAL, TEACHERS, STUDENTS
  // ============================================================
  const adminUser = await prismaSingleton.user.create({
    data: {
      email: "admin@greenwoodhigh.edu",
      email_verified: true,
      password: hashedPassword,
      name: "Alice Admin",
      dob: new Date("1985-04-12"),
      gender: Gender.FEMALE,
      status: UserStatus.ACTIVE,
      qualification: { degree: "MBA", institution: "State University" },
      phone: {
        create: {
          country_code: "+91",
          phone: "9000000001",
          is_primary: true,
          is_verified: true,
          type: PhoneType.MOBILE,
        },
      },
    },
  });

  const principalUser = await prismaSingleton.user.create({
    data: {
      email: "principal@greenwoodhigh.edu",
      email_verified: true,
      password: hashedPassword,
      name: "Peter Principal",
      dob: new Date("1975-09-23"),
      gender: Gender.MALE,
      status: UserStatus.ACTIVE,
      qualification: { degree: "PhD Education", institution: "Springfield University" },
      phone: {
        create: {
          country_code: "+91",
          phone: "9000000002",
          is_primary: true,
          is_verified: true,
          type: PhoneType.MOBILE,
        },
      },
    },
  });

  const teacherUser1 = await prismaSingleton.user.create({
    data: {
      email: "math.teacher@greenwoodhigh.edu",
      email_verified: true,
      password: hashedPassword,
      name: "Tara Mathews",
      dob: new Date("1990-02-15"),
      gender: Gender.FEMALE,
      status: UserStatus.ACTIVE,
      qualification: { degree: "M.Sc Mathematics", institution: "Springfield University" },
      phone: {
        create: {
          country_code: "+91",
          phone: "9000000003",
          is_primary: true,
          is_verified: true,
          type: PhoneType.MOBILE,
        },
      },
    },
  });

  const teacherUser2 = await prismaSingleton.user.create({
    data: {
      email: "science.teacher@greenwoodhigh.edu",
      email_verified: true,
      password: hashedPassword,
      name: "Sam Newton",
      dob: new Date("1988-11-05"),
      gender: Gender.MALE,
      status: UserStatus.ACTIVE,
      qualification: { degree: "M.Sc Physics", institution: "State University" },
      phone: {
        create: {
          country_code: "+91",
          phone: "9000000004",
          is_primary: true,
          is_verified: true,
          type: PhoneType.MOBILE,
        },
      },
    },
  });

  const studentUser1 = await prismaSingleton.user.create({
    data: {
      email: "student1@greenwoodhigh.edu",
      email_verified: true,
      password: hashedPassword,
      name: "Sam Student",
      dob: new Date("2010-06-20"),
      gender: Gender.MALE,
      status: UserStatus.ACTIVE,
      qualification: {},
      phone: {
        create: {
          country_code: "+91",
          phone: "9000000005",
          is_primary: true,
          is_verified: true,
          type: PhoneType.MOBILE,
        },
      },
    },
  });

  const studentUser2 = await prismaSingleton.user.create({
    data: {
      email: "student2@greenwoodhigh.edu",
      email_verified: true,
      password: hashedPassword,
      name: "Riya Student",
      dob: new Date("2010-09-11"),
      gender: Gender.FEMALE,
      status: UserStatus.ACTIVE,
      qualification: {},
      phone: {
        create: {
          country_code: "+91",
          phone: "9000000006",
          is_primary: true,
          is_verified: true,
          type: PhoneType.MOBILE,
        },
      },
    },
  });

  const studentUser3 = await prismaSingleton.user.create({
    data: {
      email: "student3@greenwoodhigh.edu",
      email_verified: true,
      password: hashedPassword,
      name: "Jay Student",
      dob: new Date("2010-01-30"),
      gender: Gender.MALE,
      status: UserStatus.ACTIVE,
      qualification: {},
      phone: {
        create: {
          country_code: "+91",
          phone: "9000000007",
          is_primary: true,
          is_verified: true,
          type: PhoneType.MOBILE,
        },
      },
    },
  });

  // ============================================================
  // EMPLOYEES + SALARY
  // ============================================================
  const adminEmployee = await prismaSingleton.employee.create({
    data: {
      employee_code: "EMP-ADMIN-001",
      joining_date: new Date("2020-01-15"),
      status: EmployeeStatus.ACTIVE,
      designation: Designation.ADMIN,
      user_id: adminUser.id,
      school_id: school.id,
      salary: {
        create: {
          current_salary: 45000,
          initial_salary: 35000,
          hike: 28.5,
          bank_name: "State Bank",
          account_number: "1234567890",
          ifsc_code: "SBIN0000001",
          bank_branch: "Springfield Main",
        },
      },
    },
  });

  const principalEmployee = await prismaSingleton.employee.create({
    data: {
      employee_code: "EMP-PRIN-001",
      joining_date: new Date("2015-06-01"),
      status: EmployeeStatus.ACTIVE,
      designation: Designation.PRINCIPAL,
      user_id: principalUser.id,
      school_id: school.id,
      salary: {
        create: {
          current_salary: 90000,
          initial_salary: 70000,
          hike: 28.6,
          bank_name: "State Bank",
          account_number: "1234567891",
          ifsc_code: "SBIN0000001",
          bank_branch: "Springfield Main",
        },
      },
    },
  });

  const teacherEmployee1 = await prismaSingleton.employee.create({
    data: {
      employee_code: "EMP-TCH-001",
      joining_date: new Date("2019-07-01"),
      status: EmployeeStatus.ACTIVE,
      designation: Designation.TEACHER,
      user_id: teacherUser1.id,
      school_id: school.id,
      salary: {
        create: {
          current_salary: 55000,
          initial_salary: 40000,
          hike: 37.5,
          bank_name: "HDFC Bank",
          account_number: "2234567890",
          ifsc_code: "HDFC0000002",
          bank_branch: "Springfield East",
        },
      },
      experience: {
        create: [
          {
            organization: "Riverdale School",
            designation: "Mathematics Teacher",
            start_date: new Date("2014-06-01"),
            end_date: new Date("2019-05-31"),
            description: "Taught middle and high school mathematics.",
          },
        ],
      },
    },
  });

  const teacherEmployee2 = await prismaSingleton.employee.create({
    data: {
      employee_code: "EMP-TCH-002",
      joining_date: new Date("2021-07-01"),
      status: EmployeeStatus.ACTIVE,
      designation: Designation.TEACHER,
      user_id: teacherUser2.id,
      school_id: school.id,
      salary: {
        create: {
          current_salary: 52000,
          initial_salary: 42000,
          hike: 23.8,
          bank_name: "HDFC Bank",
          account_number: "2234567891",
          ifsc_code: "HDFC0000002",
          bank_branch: "Springfield East",
        },
      },
    },
  });

  // ============================================================
  // TEACHER RECORDS
  // ============================================================
  const teacher1 = await prismaSingleton.teacher.create({
    data: { employee_id: teacherEmployee1.id },
  });

  const teacher2 = await prismaSingleton.teacher.create({
    data: { employee_id: teacherEmployee2.id },
  });

  // ============================================================
  // SUBJECT TEACHER ASSIGNMENTS
  // ============================================================
  const mathAssignment = await prismaSingleton.subjectTeacherAssignment.create({
    data: {
      class_id: classA.id,
      standard_subject_id: mathStandardSubject.id,
      teacher_id: teacher1.id,
      academic_year_id: academicYear.id,
    },
  });

  const scienceAssignment = await prismaSingleton.subjectTeacherAssignment.create({
    data: {
      class_id: classA.id,
      standard_subject_id: scienceStandardSubject.id,
      teacher_id: teacher2.id,
      academic_year_id: academicYear.id,
    },
  });

  // ============================================================
  // CLASS TEACHER ASSIGNMENT
  // ============================================================
  const classTeacherAssignment = await prismaSingleton.classTeacherAssignment.create({
    data: {
      class_id: classA.id,
      teacher_id: teacher1.id,
      academic_year_id: academicYear.id,
    },
  });

  // ============================================================
  // SCHEDULES
  // ============================================================
  await prismaSingleton.schedule.create({
    data: {
      assignment_id: mathAssignment.id,
      day: WeekDay.MONDAY,
      start_time: time("09:00"),
      end_time: time("10:00"),
      classTeacherAssignmentId: classTeacherAssignment.id,
    },
  });

  await prismaSingleton.schedule.create({
    data: {
      assignment_id: mathAssignment.id,
      day: WeekDay.WEDNESDAY,
      start_time: time("09:00"),
      end_time: time("10:00"),
      classTeacherAssignmentId: classTeacherAssignment.id,
    },
  });

  await prismaSingleton.schedule.create({
    data: {
      assignment_id: scienceAssignment.id,
      day: WeekDay.TUESDAY,
      start_time: time("10:00"),
      end_time: time("11:00"),
    },
  });

  // ============================================================
  // STUDENTS
  // ============================================================
  const student1 = await prismaSingleton.student.create({
    data: {
      user_id: studentUser1.id,
      class_id: classA.id,
      academic_year_id: academicYear.id,
    },
  });

  const student2 = await prismaSingleton.student.create({
    data: {
      user_id: studentUser2.id,
      class_id: classA.id,
      academic_year_id: academicYear.id,
    },
  });

  const student3 = await prismaSingleton.student.create({
    data: {
      user_id: studentUser3.id,
      class_id: classA.id,
      academic_year_id: academicYear.id,
    },
  });

  // ============================================================
  // EXAM + SUBMISSIONS
  // ============================================================
  const mathExam = await prismaSingleton.exam.create({
    data: {
      title: "Unit Test 1 - Algebra Basics",
      description: "Covers linear equations and basic algebraic expressions.",
      assignment_id: mathAssignment.id,
      questions: mathExamQuestions,
      total_marks: mathExamTotalMarks,
      duration_minutes: 30,
      status: ExamStatus.COMPLETED,
      scheduled_at: new Date("2025-08-10T09:00:00Z"),
    },
  });

  const student1Answers = buildMcqAnswers(mathExamQuestions, {
    1: "B",
    2: "A",
    3: "C",
    4: "B",
    5: "A", // wrong (correct is B)
  });
  await prismaSingleton.examSubmission.create({
    data: {
      exam_id: mathExam.id,
      student_id: student1.id,
      answers: student1Answers,
      score: totalScore(student1Answers),
      status: SubmissionStatus.GRADED,
      graded_by_teacher_id: teacher1.id,
      graded_at: new Date("2025-08-11T12:00:00Z"),
    },
  });
  const student2Answers = buildMcqAnswers(mathExamQuestions, {
    1: "B",
    2: "A",
    3: "C",
    4: "B",
    5: "B",
  });

  await prismaSingleton.examSubmission.create({
    data: {
      exam_id: mathExam.id,
      student_id: student2.id,
      answers: student2Answers,
      score: totalScore(student2Answers),
      status: SubmissionStatus.GRADED,
      graded_by_teacher_id: teacher1.id,
      graded_at: new Date("2025-08-11T12:05:00Z"),
    },
  });

  const student3Answers = buildMcqAnswers(mathExamQuestions, {
    1: "B",
    2: "C", // wrong (correct is A)
    3: null, // unattempted
    4: null, // unattempted
    5: "B",
  });
  await prismaSingleton.examSubmission.create({
    data: {
      exam_id: mathExam.id,
      student_id: student3.id,
      answers: student3Answers,
      status: SubmissionStatus.SUBMITTED,
    },
  });

  // ============================================================
  // SESSION (example login session for admin)
  // ============================================================
  await prismaSingleton.session.create({
    data: {
      user_id: adminUser.id,
      device_token: "seed-device-token",
      ip_address: "127.0.0.1",
      refresh_token: "seed-refresh-token-admin",
      user_agent: "seed-script/1.0",
      provider: AuthProvider.EMAIL,
      is_active: true,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  logger.info("Database seeded!");
}

main()
  .catch((e: unknown) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => {
    void prismaSingleton.$disconnect();
  });

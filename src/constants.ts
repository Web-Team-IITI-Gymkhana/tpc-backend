import { NullishPropertiesOf } from "sequelize/types/utils";
import { CompanyModel, RecruiterModel, StudentModel, UserModel } from "./db/models";
import { Optional } from "sequelize";
import { CompanyCategoryEnum, CourseEnum, RoleEnum, DepartmentEnum, CategoryEnum, GenderEnum } from "./enums";
import path from "path";
import { env } from "./config";

export const SEQUELIZE_DAO = "SEQUELIZE",
  USER_DAO = "USER_DAO",
  STUDENT_DAO = "STUDENT_DAO",
  TPC_MEMBER_DAO = "TPC_MEMBER_DAO",
  FACULTY_DAO = "FACULTY_DAO",
  FACULTY_APPROVAL_REQUEST_DAO = "FACULTY_APPROVAL_REQUEST_DAO",
  RECRUITER_DAO = "RECRUITER_DAO",
  SEASON_DAO = "SEASON_DAO",
  COMPANY_DAO = "COMPANY_DAO",
  JOB_DAO = "JOB_DAO",
  JOB_COORDINATOR_DAO = "JOB_COORDINATOR_DAO",
  JOB_STATUS_DAO = "JOB_STATUS_DAO",
  SALARY_DAO = "SALARY_DAO",
  PROGRAM_DAO = "PROGRAM_DAO",
  EVENT_DAO = "EVENT_DAO",
  RESUME_DAO = "RESUME_DAO",
  APPLICATION_DAO = "APPLICATION_DAO",
  PENALTY_DAO = "PENALTY_DAO",
  ON_CAMPUS_OFFER_DAO = "ON_CAMPUS_OFFER_DAO",
  OFF_CAMPUS_OFFER_DAO = "OFF_CAMPUS_OFFER_DAO",
  INTERVIEW_EXPERIENCE_DAO = "INTERVIEW_EXPERIENCE_DAO",
  REGISTRATIONS_DAO = "REGISTRATIONS_DAO",
  FEEDBACK_DAO = "FEEDBACK_DAO",
  EXTERNAL_OPPORTUNITIES_DAO = "EXTERNAL_OPPORTUNITIES_DAO";

export const allCourses = [
  // Bachelor of Technology (BTech)
  {
    course: CourseEnum.BTECH,
    branch: "Computer Science and Engineering",
    department: DepartmentEnum.COMPUTER_SCIENCE_AND_ENGINEERING,
  },
  { course: CourseEnum.BTECH, branch: "Electrical Engineering", department: DepartmentEnum.ELECTRICAL_ENGINEERING },
  { course: CourseEnum.BTECH, branch: "Mechanical Engineering", department: DepartmentEnum.MECHANICAL_ENGINEERING },
  { course: CourseEnum.BTECH, branch: "Civil Engineering", department: DepartmentEnum.CIVIL_ENGINEERING },
  {
    course: CourseEnum.BTECH,
    branch: "Metallurgical Engineering and Materials Science",
    department: DepartmentEnum.METALLURGICAL_ENGINEERING_AND_MATERIALS_SCIENCE,
  },
  { course: CourseEnum.BTECH, branch: "Chemical Engineering", department: DepartmentEnum.CHEMISTRY },
  { course: CourseEnum.BTECH, branch: "Mathematics and Computing", department: DepartmentEnum.MATHEMATICS },
  { course: CourseEnum.BTECH, branch: "Engineering Physics", department: DepartmentEnum.PHYSICS },
  {
    course: CourseEnum.BTECH,
    branch: "Space Sciences and Engineering (SSE)",
    department: DepartmentEnum.ASTRONOMY_ASTROPHYSICS_AND_SPACE_ENGINEERING,
  },

  // Master of Technology (MTech)
  {
    course: CourseEnum.MTECH,
    branch: "Electrical Engineering with specialization in Communication and Signal Processing",
    department: DepartmentEnum.ELECTRICAL_ENGINEERING,
  },
  {
    course: CourseEnum.MTECH,
    branch: "Electrical Engineering with specialization in VLSI Design and Nanoelectronics",
    department: DepartmentEnum.ELECTRICAL_ENGINEERING,
  },
  {
    course: CourseEnum.MTECH,
    branch: "Mechanical Engineering with specialization in Advanced Manufacturing (AM)",
    department: DepartmentEnum.MECHANICAL_ENGINEERING,
  },
  {
    course: CourseEnum.MTECH,
    branch: "Mechanical Engineering with specialization in Thermal Energy Systems (TES)",
    department: DepartmentEnum.MECHANICAL_ENGINEERING,
  },
  {
    course: CourseEnum.MTECH,
    branch: "Mechanical Engineering with specialization in Mechanical Systems Design",
    department: DepartmentEnum.MECHANICAL_ENGINEERING,
  },
  {
    course: CourseEnum.MTECH,
    branch: "Metallurgy Engineering and Materials Science with specialization in Materials Science and Engineering",
    department: DepartmentEnum.METALLURGICAL_ENGINEERING_AND_MATERIALS_SCIENCE,
  },
  {
    course: CourseEnum.MTECH,
    branch: "Metallurgy Engineering and Materials Science with specialization in Metallurgical Engineering",
    department: DepartmentEnum.METALLURGICAL_ENGINEERING_AND_MATERIALS_SCIENCE,
  },
  {
    course: CourseEnum.MTECH,
    branch:
      "M.Tech. in Electric Vehicle Technology from Center for Electric Vehicles Intelligent Transport Systems (CEVITS)",
    department: DepartmentEnum.ELECTRICAL_ENGINEERING,
  },
  {
    course: CourseEnum.MTECH,
    branch: "M.Tech. in Space Engineering from DepartmentEnum of Astronomy, Astrophysics And Space Engineering (DAASE)",
    department: DepartmentEnum.ASTRONOMY_ASTROPHYSICS_AND_SPACE_ENGINEERING,
  },
  {
    course: CourseEnum.MTECH,
    branch: "Computer Science and Engineering with specialization in Computer Science and Engineering",
    department: DepartmentEnum.COMPUTER_SCIENCE_AND_ENGINEERING,
  },
  {
    course: CourseEnum.MTECH,
    branch: "Civil Engineering with specialization in Water, Climate and Sustainability",
    department: DepartmentEnum.CIVIL_ENGINEERING,
  },
  {
    course: CourseEnum.MTECH,
    branch: "Biosciences and Biomedical Engineering with specialization in Biomedical Engineering",
    department: DepartmentEnum.BIOSCIENCES_AND_BIOMEDICAL_ENGINEERING,
  },
  {
    course: CourseEnum.MTECH,
    branch: "Mechanical Engineering with specialization in Applied Optics and laser Technology",
    department: DepartmentEnum.MECHANICAL_ENGINEERING,
  },
  {
    course: CourseEnum.MTECH,
    branch: "Civil Engineering with specialization in Structural Engineering",
    department: DepartmentEnum.CIVIL_ENGINEERING,
  },
  {
    course: CourseEnum.MTECH,
    branch: "Center of Futuristic Defence and Space Technology with specialization in Defence Technology",
    department: DepartmentEnum.ASTRONOMY_ASTROPHYSICS_AND_SPACE_ENGINEERING,
  },

  // Two-year Master of Science (MSc)
  { course: CourseEnum.MSC, branch: "Chemistry", department: DepartmentEnum.CHEMISTRY },
  { course: CourseEnum.MSC, branch: "Physics", department: DepartmentEnum.PHYSICS },
  { course: CourseEnum.MSC, branch: "Mathematics", department: DepartmentEnum.MATHEMATICS },
  {
    course: CourseEnum.MSC,
    branch: "Biotechnology",
    department: DepartmentEnum.BIOSCIENCES_AND_BIOMEDICAL_ENGINEERING,
  },
  {
    course: CourseEnum.MSC,
    branch: "Astronomy",
    department: DepartmentEnum.ASTRONOMY_ASTROPHYSICS_AND_SPACE_ENGINEERING,
  },

  // Five-year BTech + MTech
  {
    course: CourseEnum.BTECH_MTECH,
    branch: "BTech in Electrical Engineering with MTech in Communication and Signal Processing",
    department: DepartmentEnum.ELECTRICAL_ENGINEERING,
  },
  {
    course: CourseEnum.BTECH_MTECH,
    branch: "BTech in Electrical Engineering with MTech in VLSI Design and Nanoelectronics",
    department: DepartmentEnum.ELECTRICAL_ENGINEERING,
  },
  {
    course: CourseEnum.BTECH_MTECH,
    branch: "BTech in Mechanical Engineering with MTech in Production and Industrial Engineering",
    department: DepartmentEnum.MECHANICAL_ENGINEERING,
  },
  {
    course: CourseEnum.BTECH_MTECH,
    branch: "BTech in Mechanical Engineering with MTech in Mechanical Systems Design",
    department: DepartmentEnum.MECHANICAL_ENGINEERING,
  },

  // MS(Research)
  {
    course: CourseEnum.MS,
    branch: "MS (Research) in Computer Science and Engineering",
    department: DepartmentEnum.COMPUTER_SCIENCE_AND_ENGINEERING,
  },
  {
    course: CourseEnum.MS,
    branch: "MS (Research) in Electrical Engineering",
    department: DepartmentEnum.ELECTRICAL_ENGINEERING,
  },
  {
    course: CourseEnum.MS,
    branch: "MS (Research) in Mechanical Engineering",
    department: DepartmentEnum.MECHANICAL_ENGINEERING,
  },
  {
    course: CourseEnum.MS,
    branch:
      "M.S. (Research) in Space Science and Engineering from DepartmentEnum of Astronomy, Astrophysics And Space Engineering (DAASE)",
    department: DepartmentEnum.ASTRONOMY_ASTROPHYSICS_AND_SPACE_ENGINEERING,
  },
  {
    course: CourseEnum.MS,
    branch: "M.S. (Research) in Humanities and Social Science from School of Humanities and Social Science (HSS)",
    department: DepartmentEnum.HUMANITIES_AND_SOCIAL_SCIENCES,
  },
  {
    course: CourseEnum.MS,
    branch: "Master of Science in Data Science and Management (MS-DSM)",
    department: DepartmentEnum.COMPUTER_SCIENCE_AND_ENGINEERING,
  },

  // Doctor of Philosophy
  {
    course: CourseEnum.PHD,
    branch: "Computer Science and Engineering",
    department: DepartmentEnum.COMPUTER_SCIENCE_AND_ENGINEERING,
  },
  { course: CourseEnum.PHD, branch: "Electrical Engineering", department: DepartmentEnum.ELECTRICAL_ENGINEERING },
  { course: CourseEnum.PHD, branch: "Mechanical Engineering", department: DepartmentEnum.MECHANICAL_ENGINEERING },
  { course: CourseEnum.PHD, branch: "Civil Engineering", department: DepartmentEnum.CIVIL_ENGINEERING },
  {
    course: CourseEnum.PHD,
    branch: "Metallurgy Engineering and Materials Science",
    department: DepartmentEnum.METALLURGICAL_ENGINEERING_AND_MATERIALS_SCIENCE,
  },
  {
    course: CourseEnum.PHD,
    branch: "Bio-sciences and Bio-medical Engineering",
    department: DepartmentEnum.BIOSCIENCES_AND_BIOMEDICAL_ENGINEERING,
  },
  { course: CourseEnum.PHD, branch: "Chemistry", department: DepartmentEnum.CHEMISTRY },
  { course: CourseEnum.PHD, branch: "Physics", department: DepartmentEnum.PHYSICS },
  { course: CourseEnum.PHD, branch: "Mathematics", department: DepartmentEnum.MATHEMATICS },
  { course: CourseEnum.PHD, branch: "English", department: DepartmentEnum.HUMANITIES_AND_SOCIAL_SCIENCES },
  { course: CourseEnum.PHD, branch: "Philosophy", department: DepartmentEnum.HUMANITIES_AND_SOCIAL_SCIENCES },
  { course: CourseEnum.PHD, branch: "Economics", department: DepartmentEnum.HUMANITIES_AND_SOCIAL_SCIENCES },
  { course: CourseEnum.PHD, branch: "Psychology", department: DepartmentEnum.HUMANITIES_AND_SOCIAL_SCIENCES },
  { course: CourseEnum.PHD, branch: "Sociology", department: DepartmentEnum.HUMANITIES_AND_SOCIAL_SCIENCES },
  {
    course: CourseEnum.PHD,
    branch: "Astronomy, Astrophysics and Space Engineering",
    department: DepartmentEnum.ASTRONOMY_ASTROPHYSICS_AND_SPACE_ENGINEERING,
  },
  {
    course: CourseEnum.PHD,
    branch: "Centre of Advanced Electronics",
    department: DepartmentEnum.ELECTRICAL_ENGINEERING,
  },
  {
    course: CourseEnum.PHD,
    branch: "Centre for Rural Development and Technology (CRDT)",
    department: DepartmentEnum.CIVIL_ENGINEERING,
  },
  {
    course: CourseEnum.PHD,
    branch: "Center for Electric Vehicle and Intelligent Transport Systems (CEVITS)",
    department: DepartmentEnum.ELECTRICAL_ENGINEERING,
  },
  {
    course: CourseEnum.PHD,
    branch: "Center of Futuristic Defense and Space Technology (CFDST)",
    department: DepartmentEnum.ASTRONOMY_ASTROPHYSICS_AND_SPACE_ENGINEERING,
  },
];

export const YEARS = ["2023", "2024", "2025"];

export const MAX_INT = 2147483647;

export const DUMMY_COMPANY: Optional<CompanyModel, NullishPropertiesOf<CompanyModel>> = {
  id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  name: "Not Approved Yet",
  category: CompanyCategoryEnum.PSU_GOVERNMENT,
  address: {
    line1: "IIT Indore",
    city: "Indore",
    state: "Madhya Pradesh",
    country: "India",
    zipCode: "453552",
  },
  yearOfEstablishment: "2024",
};

export const DUMMY_USER: Optional<UserModel, NullishPropertiesOf<UserModel>> = {
  id: "0f88c43f-8b7b-4a5f-93a3-1c54119e3091",
  email: "dummy@tpc.com",
  name: "Not Verified",
  contact: "NA",
  role: RoleEnum.RECRUITER,
};

export const DUMMY_RECRUITER: Optional<RecruiterModel, NullishPropertiesOf<RecruiterModel>> = {
  id: "3a0a4d51-3085-4d39-8a0b-376e4e1e63a1",
  userId: "0f88c43f-8b7b-4a5f-93a3-1c54119e3091",
  companyId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  designation: "Dummy",
};

export const LOGIN_ADMIN: Optional<UserModel, NullishPropertiesOf<UserModel>> = {
  id: "8c740c84-9762-4f47-bc27-4f7e7ef4158d",
  email: "user@test.com",
  name: "Test User",
  contact: "Test",
  role: RoleEnum.ADMIN,
};

export const CUSTOM_USERS: Optional<UserModel, NullishPropertiesOf<UserModel>>[] = [
  {
    id: "994b4d15-4e5a-4e7d-b78a-6f0f4dea7e66",
    name: "Aryan Kulkarni",
    email: "me210003016@iiti.ac.in",
    contact: "9881317549",
    role: RoleEnum.STUDENT,
  },
  {
    id: "8ce6d580-26a2-4a28-a439-83d0adb4f2af",
    name: "Ishaan Mittal",
    email: "me210003039@iiti.ac.in",
    contact: "9881317549",
    role: RoleEnum.STUDENT,
  },
  {
    id: "5ca3ab28-d16c-4a0b-91cb-42b312694244",
    name: "G Aakash",
    email: "cse210003015@iiti.ac.in",
    contact: "9881317549",
    role: RoleEnum.STUDENT,
  },
  {
    id: "e9850f69-7458-425b-81fc-c06bd6e73d83",
    name: "Harsh Soni",
    email: "me210003035@iiti.ac.in",
    contact: "9881317549",
    role: RoleEnum.STUDENT,
  },
];

export const CUSTOM_STUDENTS: Optional<StudentModel, NullishPropertiesOf<StudentModel>>[] = [
  {
    programId: "427d69ed-a4b4-4463-8fc7-2949143d2812",
    rollNo: "210003016",
    category: CategoryEnum.GENERAL,
    gender: GenderEnum.MALE,
    cpi: 10,
    tenthMarks: 100,
    twelthMarks: 100,
    userId: "994b4d15-4e5a-4e7d-b78a-6f0f4dea7e66",
  },
  {
    programId: "427d69ed-a4b4-4463-8fc7-2949143d2812",
    rollNo: "210003039",
    category: CategoryEnum.GENERAL,
    gender: GenderEnum.MALE,
    cpi: 10,
    tenthMarks: 100,
    twelthMarks: 100,
    userId: "8ce6d580-26a2-4a28-a439-83d0adb4f2af",
  },
  {
    programId: "427d69ed-a4b4-4463-8fc7-2949143d2812",
    rollNo: "210001015",
    category: CategoryEnum.GENERAL,
    gender: GenderEnum.MALE,
    cpi: 10,
    tenthMarks: 100,
    twelthMarks: 100,
    userId: "5ca3ab28-d16c-4a0b-91cb-42b312694244",
  },
  {
    programId: "427d69ed-a4b4-4463-8fc7-2949143d2812",
    rollNo: "210003035",
    category: CategoryEnum.GENERAL,
    gender: GenderEnum.MALE,
    cpi: 10,
    tenthMarks: 100,
    twelthMarks: 100,
    userId: "e9850f69-7458-425b-81fc-c06bd6e73d83",
  },
];

export const LOGIN_STUDENT = {};

export const LOGIN_FACULTY = {};

export const LOGIN_RECRUITER = {};

export const LOGIN_TPC_MEMBER = {};

export const RESUME_SIZE_LIMIT = 102400; // 1MB
export const IE_SIZE_LIMIT = RESUME_SIZE_LIMIT * 100; // 10MB.
export const JD_SIZE_LIMIT = RESUME_SIZE_LIMIT * 100; // 10MB.
export const POLICY_SIZE_LIMIT = RESUME_SIZE_LIMIT * 100; // 10MB.
export const MAX_RESUMES_PER_STUDENT = 10; // Maximum number of resumes a student can upload

export const ROLES_KEY = "roles";

export const RESUME_FOLDER = path.join(env().UPLOAD_DIR, "resume");
export const JD_FOLDER = path.join(env().UPLOAD_DIR, "jd");
export const IE_FOLDER = path.join(env().UPLOAD_DIR, "ie");
export const POLICY_FOLDER = path.join(env().UPLOAD_DIR, "policy");

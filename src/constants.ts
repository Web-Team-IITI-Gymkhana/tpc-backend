import { NullishPropertiesOf } from "sequelize/types/utils";
import { CompanyModel, RecruiterModel, UserModel } from "./db/models";
import { DepartmentEnum } from "./enums/department.enum";
import { Optional } from "sequelize";
import { CompanyCategoryEnum, RoleEnum } from "./enums";

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
  REGISTRATIONS_DAO = "REGISTRATIONS_DAO";

export const allCourses = [
  // Bachelor of Technology (BTech)
  {
    course: "BTech",
    branch: "Computer Science and Engineering",
    department: DepartmentEnum.COMPUTER_SCIENCE_AND_ENGINEERING,
  },
  { course: "BTech", branch: "Electrical Engineering", department: DepartmentEnum.ELECTRICAL_ENGINEERING },
  { course: "BTech", branch: "Mechanical Engineering", department: DepartmentEnum.MECHANICAL_ENGINEERING },
  { course: "BTech", branch: "Civil Engineering", department: DepartmentEnum.CIVIL_ENGINEERING },
  {
    course: "BTech",
    branch: "Metallurgical Engineering and Materials Science",
    department: DepartmentEnum.METALLURGICAL_ENGINEERING_AND_MATERIALS_SCIENCE,
  },
  { course: "BTech", branch: "Chemical Engineering", department: DepartmentEnum.CHEMISTRY },
  { course: "BTech", branch: "Mathematics and Computing", department: DepartmentEnum.MATHEMATICS },
  { course: "BTech", branch: "Engineering Physics", department: DepartmentEnum.PHYSICS },
  {
    course: "BTech",
    branch: "Space Sciences and Engineering (SSE)",
    department: DepartmentEnum.ASTRONOMY_ASTROPHYSICS_AND_SPACE_ENGINEERING,
  },

  // Master of Technology (MTech)
  {
    course: "MTech",
    branch: "Electrical Engineering with specialization in Communication and Signal Processing",
    department: DepartmentEnum.ELECTRICAL_ENGINEERING,
  },
  {
    course: "MTech",
    branch: "Electrical Engineering with specialization in VLSI Design and Nanoelectronics",
    department: DepartmentEnum.ELECTRICAL_ENGINEERING,
  },
  {
    course: "MTech",
    branch: "Mechanical Engineering with specialization in Advanced Manufacturing (AM)",
    department: DepartmentEnum.MECHANICAL_ENGINEERING,
  },
  {
    course: "MTech",
    branch: "Mechanical Engineering with specialization in Thermal Energy Systems (TES)",
    department: DepartmentEnum.MECHANICAL_ENGINEERING,
  },
  {
    course: "MTech",
    branch: "Mechanical Engineering with specialization in Mechanical Systems Design",
    department: DepartmentEnum.MECHANICAL_ENGINEERING,
  },
  {
    course: "MTech",
    branch: "Metallurgy Engineering and Materials Science with specialization in Materials Science and Engineering",
    department: DepartmentEnum.METALLURGICAL_ENGINEERING_AND_MATERIALS_SCIENCE,
  },
  {
    course: "MTech",
    branch: "Metallurgy Engineering and Materials Science with specialization in Metallurgical Engineering",
    department: DepartmentEnum.METALLURGICAL_ENGINEERING_AND_MATERIALS_SCIENCE,
  },
  {
    course: "MTech",
    branch:
      "M.Tech. in Electric Vehicle Technology from Center for Electric Vehicles Intelligent Transport Systems (CEVITS)",
    department: DepartmentEnum.ELECTRICAL_ENGINEERING,
  },
  {
    course: "MTech",
    branch: "M.Tech. in Space Engineering from DepartmentEnum of Astronomy, Astrophysics And Space Engineering (DAASE)",
    department: DepartmentEnum.ASTRONOMY_ASTROPHYSICS_AND_SPACE_ENGINEERING,
  },
  {
    course: "MTech",
    branch: "Computer Science and Engineering with specialization in Computer Science and Engineering",
    department: DepartmentEnum.COMPUTER_SCIENCE_AND_ENGINEERING,
  },
  {
    course: "MTech",
    branch: "Civil Engineering with specialization in Water, Climate and Sustainability",
    department: DepartmentEnum.CIVIL_ENGINEERING,
  },
  {
    course: "MTech",
    branch: "Biosciences and Biomedical Engineering with specialization in Biomedical Engineering",
    department: DepartmentEnum.BIOSCIENCES_AND_BIOMEDICAL_ENGINEERING,
  },
  {
    course: "MTech",
    branch: "Mechanical Engineering with specialization in Applied Optics and laser Technology",
    department: DepartmentEnum.MECHANICAL_ENGINEERING,
  },
  {
    course: "MTech",
    branch: "Civil Engineering with specialization in Structural Engineering",
    department: DepartmentEnum.CIVIL_ENGINEERING,
  },
  {
    course: "MTech",
    branch: "Center of Futuristic Defence and Space Technology with specialization in Defence Technology",
    department: DepartmentEnum.ASTRONOMY_ASTROPHYSICS_AND_SPACE_ENGINEERING,
  },

  // Two-year Master of Science (MSc)
  { course: "MSc", branch: "Chemistry", department: DepartmentEnum.CHEMISTRY },
  { course: "MSc", branch: "Physics", department: DepartmentEnum.PHYSICS },
  { course: "MSc", branch: "Mathematics", department: DepartmentEnum.MATHEMATICS },
  { course: "MSc", branch: "Biotechnology", department: DepartmentEnum.BIOSCIENCES_AND_BIOMEDICAL_ENGINEERING },
  { course: "MSc", branch: "Astronomy", department: DepartmentEnum.ASTRONOMY_ASTROPHYSICS_AND_SPACE_ENGINEERING },

  // Five-year BTech + MTech
  {
    course: "BTech + MTech",
    branch: "BTech in Electrical Engineering with MTech in Communication and Signal Processing",
    department: DepartmentEnum.ELECTRICAL_ENGINEERING,
  },
  {
    course: "BTech + MTech",
    branch: "BTech in Electrical Engineering with MTech in VLSI Design and Nanoelectronics",
    department: DepartmentEnum.ELECTRICAL_ENGINEERING,
  },
  {
    course: "BTech + MTech",
    branch: "BTech in Mechanical Engineering with MTech in Production and Industrial Engineering",
    department: DepartmentEnum.MECHANICAL_ENGINEERING,
  },
  {
    course: "BTech + MTech",
    branch: "BTech in Mechanical Engineering with MTech in Mechanical Systems Design",
    department: DepartmentEnum.MECHANICAL_ENGINEERING,
  },

  // MS(Research)
  {
    course: "MS(Research)",
    branch: "MS (Research) in Computer Science and Engineering",
    department: DepartmentEnum.COMPUTER_SCIENCE_AND_ENGINEERING,
  },
  {
    course: "MS(Research)",
    branch: "MS (Research) in Electrical Engineering",
    department: DepartmentEnum.ELECTRICAL_ENGINEERING,
  },
  {
    course: "MS(Research)",
    branch: "MS (Research) in Mechanical Engineering",
    department: DepartmentEnum.MECHANICAL_ENGINEERING,
  },
  {
    course: "MS(Research)",
    branch:
      "M.S. (Research) in Space Science and Engineering from DepartmentEnum of Astronomy, Astrophysics And Space Engineering (DAASE)",
    department: DepartmentEnum.ASTRONOMY_ASTROPHYSICS_AND_SPACE_ENGINEERING,
  },
  {
    course: "MS(Research)",
    branch: "M.S. (Research) in Humanities and Social Science from School of Humanities and Social Science (HSS)",
    department: DepartmentEnum.HUMANITIES_AND_SOCIAL_SCIENCES,
  },
  {
    course: "MS(Research)",
    branch: "Master of Science in Data Science and Management (MS-DSM)",
    department: DepartmentEnum.COMPUTER_SCIENCE_AND_ENGINEERING,
  },

  // Doctor of Philosophy
  {
    course: "PhD",
    branch: "Computer Science and Engineering",
    department: DepartmentEnum.COMPUTER_SCIENCE_AND_ENGINEERING,
  },
  { course: "PhD", branch: "Electrical Engineering", department: DepartmentEnum.ELECTRICAL_ENGINEERING },
  { course: "PhD", branch: "Mechanical Engineering", department: DepartmentEnum.MECHANICAL_ENGINEERING },
  { course: "PhD", branch: "Civil Engineering", department: DepartmentEnum.CIVIL_ENGINEERING },
  {
    course: "PhD",
    branch: "Metallurgy Engineering and Materials Science",
    department: DepartmentEnum.METALLURGICAL_ENGINEERING_AND_MATERIALS_SCIENCE,
  },
  {
    course: "PhD",
    branch: "Bio-sciences and Bio-medical Engineering",
    department: DepartmentEnum.BIOSCIENCES_AND_BIOMEDICAL_ENGINEERING,
  },
  { course: "PhD", branch: "Chemistry", department: DepartmentEnum.CHEMISTRY },
  { course: "PhD", branch: "Physics", department: DepartmentEnum.PHYSICS },
  { course: "PhD", branch: "Mathematics", department: DepartmentEnum.MATHEMATICS },
  { course: "PhD", branch: "English", department: DepartmentEnum.HUMANITIES_AND_SOCIAL_SCIENCES },
  { course: "PhD", branch: "Philosophy", department: DepartmentEnum.HUMANITIES_AND_SOCIAL_SCIENCES },
  { course: "PhD", branch: "Economics", department: DepartmentEnum.HUMANITIES_AND_SOCIAL_SCIENCES },
  { course: "PhD", branch: "Psychology", department: DepartmentEnum.HUMANITIES_AND_SOCIAL_SCIENCES },
  { course: "PhD", branch: "Sociology", department: DepartmentEnum.HUMANITIES_AND_SOCIAL_SCIENCES },
  {
    course: "PhD",
    branch: "Astronomy, Astrophysics and Space Engineering",
    department: DepartmentEnum.ASTRONOMY_ASTROPHYSICS_AND_SPACE_ENGINEERING,
  },
  { course: "PhD", branch: "Centre of Advanced Electronics", department: DepartmentEnum.ELECTRICAL_ENGINEERING },
  {
    course: "PhD",
    branch: "Centre for Rural Development and Technology (CRDT)",
    department: DepartmentEnum.CIVIL_ENGINEERING,
  },
  {
    course: "PhD",
    branch: "Center for Electric Vehicle and Intelligent Transport Systems (CEVITS)",
    department: DepartmentEnum.ELECTRICAL_ENGINEERING,
  },
  {
    course: "PhD",
    branch: "Center of Futuristic Defense and Space Technology (CFDST)",
    department: DepartmentEnum.ASTRONOMY_ASTROPHYSICS_AND_SPACE_ENGINEERING,
  },
];

export const YEARS = ["2023", "2024", "2025"];

export const MAX_INT = 2147483647;

export const DUMMY_COMPANY: Optional<CompanyModel, NullishPropertiesOf<CompanyModel>> = {
  id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  name: "Not Approved Yet",
  category: CompanyCategoryEnum.GOVERNMENT,
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

export const LOGIN_USER: Optional<UserModel, NullishPropertiesOf<UserModel>> = {
  id: "8c740c84-9762-4f47-bc27-4f7e7ef4158d",
  email: "user@test.com",
  name: "Test User",
  contact: "Test",
  role: RoleEnum.ADMIN,
};

export const RESUME_SIZE_LIMIT = 102400; // 1MB
export const IE_SIZE_LIMIT = RESUME_SIZE_LIMIT * 10; // 10MB.

export const ROLES_KEY = "roles";

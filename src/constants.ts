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
  OFF_CAMPUS_OFFER_DAO = "OFF_CAMPUS_OFFER_DAO";

export enum CourseEnum {
  BTECH = "BTECH",
  MTECH = "MTECH",
  MSC = "MSC",
  MS_RESEARCH = "MS_RESEARCH",
  PHD = "PHD",
}
export enum BranchesEnum {
  MECHANICAL = "MECHANICAL",
  ELECTRICAL = "ELECTRICAL",
  CIVIL = "CIVIL",
  COMPUTER_SCIENCE = "COMPUTER_SCIENCE",
  METALLURGICAL = "METALLURGICAL",

  SPACE_ENG = "SPACE_ENG",
  COMMUNICATION_SIGNAL = "COMMUNICATION_SIGNAL",
  VLSI_DESIGN = "VLSI_DESIGN",
  ELECTRIC_VEHICLE = "ELECTRIC_VEHICLE",
  ADVANCED_MANUFACTURING = "ADVANCED_MANUFACTURING",
  MECHANICAL_SYSTEM_DESIGN = "MECHANICAL_SYSTEM_DESIGN",
  THERMAL_ENERGY_SYSTEM = "THERMAL_ENERGY_SYSTEM",
  MATERIAL_SCIENCE = "MATERIAL_SCIENCE",
  METALLURGICAL_ENG = "METALLURGICAL_ENG",

  ASTRONOMY = "ASTRONOMY",
  BIOTECHNOLOGY = "BIOTECHNOLOGY",
  CHEMISTRY = "CHEMISTRY",
  MATHEMATICS = "MATHEMATICS",
  PHYSICS = "PHYSICS",

  SPACE_SCIENCE = "SPACE_SCIENCE",
  HSS = "HSS",

  BIOSCIENCES = "BIOSCIENCES",
}

export const COURSE_BRANCH_MAP = {
  [CourseEnum.BTECH]: [BranchesEnum.MECHANICAL, BranchesEnum.ELECTRICAL],

  [CourseEnum.MTECH]: [
    BranchesEnum.SPACE_ENG,
    BranchesEnum.COMMUNICATION_SIGNAL,
    BranchesEnum.VLSI_DESIGN,
    BranchesEnum.ELECTRIC_VEHICLE,
    BranchesEnum.ADVANCED_MANUFACTURING,
    BranchesEnum.MECHANICAL_SYSTEM_DESIGN,
    BranchesEnum.THERMAL_ENERGY_SYSTEM,
    BranchesEnum.MATERIAL_SCIENCE,
    BranchesEnum.METALLURGICAL_ENG,
  ],

  [CourseEnum.MSC]: [
    BranchesEnum.ASTRONOMY,
    BranchesEnum.BIOTECHNOLOGY,
    BranchesEnum.CHEMISTRY,
    BranchesEnum.MATHEMATICS,
    BranchesEnum.PHYSICS,
  ],

  [CourseEnum.MS_RESEARCH]: [
    BranchesEnum.SPACE_SCIENCE,
    BranchesEnum.COMPUTER_SCIENCE,
    BranchesEnum.ELECTRICAL,
    BranchesEnum.HSS,
    BranchesEnum.MECHANICAL,
  ],

  [CourseEnum.PHD]: [
    BranchesEnum.ASTRONOMY,
    BranchesEnum.BIOSCIENCES,
    BranchesEnum.CHEMISTRY,
    BranchesEnum.CIVIL,
    BranchesEnum.COMPUTER_SCIENCE,
    BranchesEnum.ELECTRICAL,
    BranchesEnum.HSS,
    BranchesEnum.MATHEMATICS,
    BranchesEnum.MECHANICAL,
    BranchesEnum.METALLURGICAL,
    BranchesEnum.PHYSICS,
  ],
};
export const YEARS = ["2023", "2024", "2025"];

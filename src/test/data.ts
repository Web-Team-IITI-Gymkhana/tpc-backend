import { randomUUID } from "crypto";
import { Category, CompanyCategory, Gender, Role, SeasonType, TpcMemberRole } from "src/enums";
import { Countries } from "src/enums/Country.enum";
import { SelectionMode } from "src/enums/selectionMode.enum";

export const SEASON1 = {
  id: randomUUID(),
  type: SeasonType.PLACEMENT,
  year: "2023",
};

export const SEASON2 = {
  type: SeasonType.INTERN,
  year: "2023",
};

export const SEASONS = [SEASON1, SEASON2];

export const ADDRESS1 = {
  line1: "line1",
  line2: "line2",
  city: "city",
  state: "State",
  zipCode: "121212",
  country: Countries.IND,
};

export const ADDRESS2 = {
  line1: "line10",
  line2: "line20",
  city: "city",
  state: "State",
  zipCode: "121212",
  country: Countries.IND,
};

export const COMPANY1 = {
  id: randomUUID(),
  name: "company1",
  category: CompanyCategory.PSU,
  address: ADDRESS1,
  yearOfEstablishment: 2004,
};

export const COMPANY2 = {
  id: randomUUID(),
  name: "company2",
  category: CompanyCategory.MNC,
  address: ADDRESS2,
  yearOfEstablishment: 2004,
};

export const COMPANIES = [COMPANY1, COMPANY2];

export const USER1 = {
  id: randomUUID(),
  name: "User 1",
  email: "user1@test.com",
  contact: "237842949",
  role: Role.ADMIN,
};

export const USER2 = {
  id: randomUUID(),
  name: "User 2",
  email: "user2@test.com",
  contact: "237842949",
  role: Role.STUDENT,
};

export const USER3 = {
  id: randomUUID(),
  name: "User 3",
  email: "user3@test.com",
  contact: "237842949",
  role: Role.RECRUITER,
};

export const USER4 = {
  id: randomUUID(),
  name: "User 4",
  email: "user4@test.com",
  contact: "237842949",
  role: Role.FACULTY,
};

export const USER5 = {
  id: randomUUID(),
  name: "User 5",
  email: "user5@test.com",
  contact: "237842949",
  role: Role.TPC_MEMBER,
};

export const USERS = [USER1, USER2, USER3, USER4, USER5];

export const STUDENT1 = {
  userId: USER2.id,
  cpi: 7.0,
  programId: "program1",
  category: Category.GENERAL,
  gender: Gender.MALE,
  rollNo: "230001001",
};

export const RECRUITER1 = {
  id: randomUUID(),
  companyId: COMPANY1.id,
  userId: USER3.id,
  designation: "HR",
  landline: "8267",
};

export const RECRUITERS = [RECRUITER1];

export const FACULTY1 = {
  department: "department1",
  userId: USER4.id,
};

export const TPC_MEMBER1 = {
  id: randomUUID(),
  userId: USER5.id,
  department: "department2",
  role: TpcMemberRole.MANAGER,
};

export const TPC_MEMBERS = [TPC_MEMBER1];

export const selectionProcedure = {
  selectionMode: SelectionMode.OFFLINE,
  shortlistFromResume: true,
  groupDiscussion: true,
  tests: [],
  interviews: [],
};

export const JOB1 = {
  seasonId: SEASON1.id,
  recruiterId: RECRUITER1.id,
  companyId: COMPANY1.id,
  role: "SDE",
  skills: "None",
  location: "Anything",
  selectionProcedure: selectionProcedure,
  active: true,
  currentStatus: "INITIALIZED",
};

export const JOBS = [JOB1];

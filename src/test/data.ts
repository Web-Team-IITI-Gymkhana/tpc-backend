import { Category, CompanyCategory, Gender, Role, SeasonType, TpcMemberRole } from "src/db/enums";
import { Company } from "src/entities/Company";
import { Faculty } from "src/entities/Faculty";
import { Recruiter } from "src/entities/Recruiter";
import { Season } from "src/entities/Season";
import { Student } from "src/entities/Student";
import { TpcMember } from "src/entities/TpcMember";
import { User } from "src/entities/User";
import { randomUUID } from "crypto";
import { Countries } from "src/db/enums/Country.enum";
import { Job } from "src/entities/Job";
import { SelectionProcedureDetailsDto } from "src/dtos/jaf";
import { SelectionMode } from "src/db/enums/selectionMode.enum";
import { AddressDto } from "src/dtos/jaf";

export const SEASON1: Season = {
  id: randomUUID(),
  type: SeasonType.PLACEMENT,
  year: "2023",
};

export const SEASON2: Season = {
  type: SeasonType.INTERN,
  year: "2023",
};

export const SEASONS = [SEASON1, SEASON2];

export const ADDRESS1: AddressDto = {
  line1: "line1",
  line2: "line2",
  city: "city",
  state: "State",
  zipCode: "121212",
  country: Countries.IND,
};

export const ADDRESS2: AddressDto = {
  line1: "line10",
  line2: "line20",
  city: "city",
  state: "State",
  zipCode: "121212",
  country: Countries.IND,
};

export const COMPANY1: Company = {
  id: randomUUID(),
  name: "company1",
  category: CompanyCategory.PSU,
  address: ADDRESS1,
  yearOfEstablishment: 2004,
};

export const COMPANY2: Company = {
  id: randomUUID(),
  name: "company2",
  category: CompanyCategory.MNC,
  address: ADDRESS2,
  yearOfEstablishment: 2004,
};

export const COMPANIES = [COMPANY1, COMPANY2];

export const USER1: User = {
  id: randomUUID(),
  name: "User 1",
  email: "user1@test.com",
  contact: "237842949",
  role: Role.ADMIN,
};

export const USER2: User = {
  id: randomUUID(),
  name: "User 2",
  email: "user2@test.com",
  contact: "237842949",
  role: Role.STUDENT,
};

export const USER3: User = {
  id: randomUUID(),
  name: "User 3",
  email: "user3@test.com",
  contact: "237842949",
  role: Role.RECRUITER,
};

export const USER4: User = {
  id: randomUUID(),
  name: "User 4",
  email: "user4@test.com",
  contact: "237842949",
  role: Role.FACULTY,
};

export const USER5: User = {
  id: randomUUID(),
  name: "User 5",
  email: "user5@test.com",
  contact: "237842949",
  role: Role.TPC_MEMBER,
};

export const USERS = [USER1, USER2, USER3, USER4, USER5];

export const STUDENT1: Student = {
  userId: USER2.id,
  cpi: 7.0,
  programId: "program1",
  category: Category.GENERAL,
  gender: Gender.MALE,
  rollNo: "230001001",
};

export const RECRUITER1: Recruiter = {
  id: randomUUID(),
  companyId: COMPANY1.id,
  userId: USER3.id,
  designation: "HR",
  landline: "8267",
};

export const RECRUITERS = [RECRUITER1];

export const FACULTY1: Faculty = {
  department: "department1",
  userId: USER4.id,
};

export const TPC_MEMBER1: TpcMember = {
  id: randomUUID(),
  userId: USER5.id,
  department: "department2",
  role: TpcMemberRole.MANAGER,
};

export const TpcMembers = [TPC_MEMBER1];

export const SelectionProcedure: SelectionProcedureDetailsDto = {
  selectionMode: SelectionMode.OFFLINE,
  shortlistFromResume: true,
  groupDiscussion: true,
  tests: [],
  interviews: [],
};

export const Job1 = {
  seasonId: SEASON1.id,
  recruiterId: RECRUITER1.id,
  companyId: COMPANY1.id,
  role: "SDE",
  skills: "None",
  location: "Anything",
  selectionProcedure: SelectionProcedure,
  active: true,
  currentStatus: "INITIALIZED",
};

export const JOBS = [Job1];

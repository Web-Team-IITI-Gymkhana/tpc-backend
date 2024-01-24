import { Category, Gender, Role, SeasonType, TpcMemberRole } from "src/db/enums";
import { Company } from "src/entities/Company";
import { Faculty } from "src/entities/Faculty";
import { Recruiter } from "src/entities/Recruiter";
import { Season } from "src/entities/Season";
import { Student } from "src/entities/Student";
import { TpcMember } from "src/entities/TpcMember";
import { User } from "src/entities/User";

export const SEASON1: Season = {
  type: SeasonType.PLACEMENT,
  year: "2023",
};

export const SEASON2: Season = {
  type: SeasonType.INTERN,
  year: "2023",
};

// export const COMPANY1: Company = {
//   id: "company1",
//   name: "company1",
//   metadata: {
//     description: "desc 1",
//   },
// };

// export const COMPANY2: Company = {
//   id: "company2",
//   name: "company2",
//   metadata: {
//     description: "desc 2",
//   },
// };

export const USER1: User = {
  name: "User 1",
  email: "user1@test.com",
  contact: "237842949",
  role: Role.ADMIN,
};

// export const USER2: User = {
//   id: "user2",
//   name: "User 2",
//   email: "user2@test.com",
//   contact: "237842949",
//   role: Role.STUDENT,
// };

// export const STUDENT1: Student = {
//   id: "student1",
//   userId: USER2.id,
//   programId: "program1",
//   category: Category.GENERAL,
//   gender: Gender.MALE,
//   rollNo: "230001001",
// };

// export const USER3: User = {
//   id: "user3",
//   name: "User 3",
//   email: "user3@test.com",
//   contact: "237842949",
//   role: Role.RECRUITER,
// };

// export const RECRUITER1: Recruiter = {
//   id: "recruiter1",
//   companyId: COMPANY1.id,
//   userId: USER3.id,
// };

// export const USER4: User = {
//   name: "User 4",
//   email: "user4@test.com",
//   contact: "237842949",
//   role: Role.FACULTY,
// };

// export const FACULTY1: Faculty = {
//   department: "department1",
//   userId: USER4.id,
// };

// export const USER5: User = {
//   name: "User 5",
//   email: "user5@test.com",
//   contact: "237842949",
//   role: Role.TPC_MEMBER,
// };

// export const TPC_MEMBER1: TpcMember = {
//   id: "tpcMember1",
//   userId: USER5.id,
//   department: "department2",
//   role: TpcMemberRole.MANAGER,
// };

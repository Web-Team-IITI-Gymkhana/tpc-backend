import { YEARS } from "src/constants";
import { Role, SeasonType } from "src/db/enums";
import { Company } from "src/entities/Company";
import { Season } from "src/entities/Season";
import { User } from "src/entities/User";

export const SEASON1: Season = {
  id: "season1",
  type: SeasonType.PLACEMENT,
  year: "2023",
};

export const SEASON2: Season = {
  id: "season2",
  type: SeasonType.INTERN,
  year: "2023",
};

export const COMPANY1: Company = {
  id: "company1",
  name: "company1",
  metadata: {
    description: "desc 1",
  },
};

export const COMPANY2: Company = {
  id: "company2",
  name: "company2",
  metadata: {
    description: "desc 2",
  },
};

export const USER1: User = {
  id: "user1",
  name: "User 1",
  email: "user1@test.com",
  contact: "237842949",
  role: Role.ADMIN,
};

export const USER2: User = {
  id: "user2",
  name: "User 2",
  email: "user2@test.com",
  contact: "237842949",
  role: Role.STUDENT,
};

export const USER3: User = {
  id: "user3",
  name: "User 3",
  email: "user3@test.com",
  contact: "237842949",
  role: Role.RECRUITER,
};

export const USER4: User = {
  id: "user4",
  name: "User 4",
  email: "user4@test.com",
  contact: "237842949",
  role: Role.FACULTY,
};

export const USER5: User = {
  id: "user5",
  name: "User 5",
  email: "user5@test.com",
  contact: "237842949",
  role: Role.TPC_MEMBER,
};

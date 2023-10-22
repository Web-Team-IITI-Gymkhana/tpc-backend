import { Company } from "./models/company";
import { EligibleRoles } from "./models/eligibleRoles";
import { Event } from "./models/event";
import { FacultyCoordinatorApproval } from "./models/facultyCoordinatorApproval";
import { FacultyCoordinator } from "./models/facultyCoordinator";
import { Jaf } from "./models/jaf";
import { Member } from "./models/member";
import { OnCampusOffer } from "./models/onCampusOffer";
import { Penalties } from "./models/penalties";
import { PpoOffer } from "./models/ppoOffer";
import { RolesOffered } from "./models/rolesOffered";
import { Rounds } from "./models/rounds";
import { Season } from "./models/season";
import { Student } from "./models/student";
import { TpcCoordinator } from "./models/tpcCoordinator";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [
    Company,
    EligibleRoles,
    Event,
    FacultyCoordinator,
    FacultyCoordinatorApproval,
    Jaf,
    Member,
    OnCampusOffer,
    Penalties,
    PpoOffer,
    RolesOffered,
    Rounds,
    Season,
    Student,
    TpcCoordinator,
  ],
};

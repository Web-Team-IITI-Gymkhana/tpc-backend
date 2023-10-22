import { randomUUID } from "crypto";
import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table, HasMany } from "sequelize-typescript";
import { Company } from "./company";
import { Event } from "./event";
import { Member } from "./member";
import { Season } from "./season";
import { TpcCoordinator } from "./tpcCoordinator";
import { FacultyCoordinatorApproval } from "./facultyCoordinatorApproval";
import { OnCampusOffer } from "./onCampusOffer";
import { RolesOffered } from "./rolesOffered";
import { Status } from "../enums/jaf.enum";

@Table({
  tableName: "Jaf",
})
export class Jaf extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @ForeignKey(() => Season)
  @Column(sequelize.UUID)
  seasonId: typeof randomUUID;
  @BelongsTo(() => Season, "seasonId")
  season: Season;

  @ForeignKey(() => Member)
  @Column(sequelize.UUID)
  recruiterId: typeof randomUUID;
  @BelongsTo(() => Member, "recruiterId")
  member: Member;

  @ForeignKey(() => Company)
  @Column(sequelize.UUID)
  companyId: typeof randomUUID;
  @BelongsTo(() => Company, "companyId")
  company: Company;

  @Column
  role: string;

  @Column
  metadata: string;

  @Column
  docs: string;

  @Column
  accepted: boolean;

  @Column
  publicAccess: boolean;

  @Column
  eligibility: string;

  @Column({
    type: sequelize.ENUM,
    values: Object.values(Status),
  })
  status: Status;

  @HasMany(() => Event, "jafId")
  events: Event[];

  @HasMany(() => TpcCoordinator, "jafId")
  tpcCoordinators: TpcCoordinator[];

  @HasMany(() => FacultyCoordinatorApproval, "jafId")
  facultyCoordinatorApprovals: FacultyCoordinatorApproval[];

  @HasMany(() => OnCampusOffer, "jafId")
  onCampusOffers: OnCampusOffer[];

  @HasMany(() => RolesOffered, "jafId")
  rolesOffered: RolesOffered[];
}

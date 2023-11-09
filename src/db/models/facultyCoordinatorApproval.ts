import { randomUUID } from "crypto";
import sequelize from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table, Index, Unique } from "sequelize-typescript";
import { Member } from "./member";
import { Jaf } from "./jaf";
import { FacultyApproval } from "../enums/facultyApproval.enum";

@Table({
  tableName: "FacultyCoordinatorApproval",
})
export class FacultyCoordinatorApproval extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: typeof randomUUID;

  @Index({ name: "JafId" })
  @Unique("FacultyJafUnique")
  @ForeignKey(() => Jaf)
  @Column(sequelize.UUID)
  jafId: typeof randomUUID;
  @BelongsTo(() => Jaf, "jafId")
  jaf: Jaf;

  @ForeignKey(() => Member)
  @Unique("FacultyJafUnique")
  @Column({ type: sequelize.UUID })
  facultyId: typeof randomUUID;
  @BelongsTo(() => Member, "facultyId")
  member: Member;

  @Column({
    type: sequelize.ENUM,
    values: Object.values(FacultyApproval),
  })
  approval: FacultyApproval;

  @Column
  remarks: string;
}

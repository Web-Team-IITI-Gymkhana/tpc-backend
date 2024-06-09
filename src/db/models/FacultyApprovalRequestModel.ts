import { Table, Column, Model, ForeignKey, Unique, BelongsTo, AfterBulkCreate } from "sequelize-typescript";
import sequelize from "sequelize";
import { FacultyModel } from "./FacultyModel";
import { SalaryModel } from "./SalaryModel";
import { FacultyApprovalStatusEnum } from "src/enums";
import { EmailService } from "src/services/EmailService";
import { SendEmailDto } from "src/services/EmailService";
import { UserModel } from "./UserModel";
import { IEnvironmentVariables, env } from "src/config";
import { NotFoundException } from "@nestjs/common";

const environmentVariables: IEnvironmentVariables = env();
const { MAIL_USER, APP_NAME, DEFAULT_MAIL_TO } = environmentVariables;

@Table({
  tableName: "FacultyApprovalRequest",
})
export class FacultyApprovalRequestModel extends Model<FacultyApprovalRequestModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @Unique("FacultyJob")
  @ForeignKey(() => FacultyModel)
  @Column({ type: sequelize.UUID, unique: true, allowNull: false })
  facultyId: string;

  // Delete Faculty Approval Request onDelete of Faculty
  @BelongsTo(() => FacultyModel, {
    foreignKey: "facultyId",
    onDelete: "RESTRICT",
  })
  faculty: FacultyModel;

  @Unique("FacultyJob")
  @ForeignKey(() => SalaryModel)
  @Column({ type: sequelize.UUID, unique: true, allowNull: false })
  salaryId: string;

  // Delete Faculty Approval Request onDelete of Job
  @BelongsTo(() => SalaryModel, {
    foreignKey: "salaryId",
    onDelete: "CASCADE",
  })
  salary: SalaryModel;

  @Column({
    type: sequelize.ENUM(...Object.values(FacultyApprovalStatusEnum)),
    defaultValue: FacultyApprovalStatusEnum.PENDING,
    allowNull: false,
  })
  status: FacultyApprovalStatusEnum;

  @Column({
    type: sequelize.STRING,
  })
  remarks?: string;

  @AfterBulkCreate
  static async sendEmailHook(instance: FacultyApprovalRequestModel[]) {
    const mailerService = new EmailService();

    for (const approvalRequest of instance) {
      const faculty = await FacultyModel.findByPk(approvalRequest.facultyId, {
        include: [
          {
            model: UserModel,
            as: "user",
          },
        ],
      });
      if (!faculty) {
        throw new NotFoundException(`Faculty not found for offer ${approvalRequest.id}`);
        continue;
      }
      if (!faculty.user) {
        throw new NotFoundException(`User not found for faculty ${faculty.id}`);
        continue;
      }

      const dto: SendEmailDto = {
        from: { name: APP_NAME, address: MAIL_USER },
        // recepients: [{ address: DEFAULT_MAIL_TO }],
        recepients: [{ address: faculty.user.email }],
        subject: "Test email",
        html: `<p>Hi ${faculty.user.name}, there is an Approval Request for you</p>`,
      };

      await mailerService.sendEmail(dto);
    }
  }
}

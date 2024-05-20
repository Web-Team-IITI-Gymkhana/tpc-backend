/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import sequelize, { Sequelize } from "sequelize";
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
  HasMany,
  Unique,
  DataType,
  HasOne,
  AfterCreate,
  AfterUpdate,
  AfterBulkUpdate,
  BeforeBulkUpdate,
} from "sequelize-typescript";
import { CompanyModel } from "./CompanyModel";
import { EventModel } from "./EventModel";
import { SeasonModel } from "./SeasonModel";
import { RecruiterModel } from "./RecruiterModel";
import { SalaryModel } from "./SalaryModel";
import { JobCoordinatorModel } from "./JobCoordinatorModel";
import { FacultyApprovalRequestModel } from "./FacultyApprovalRequestModel";
import { JobStatusTypeEnum } from "src/enums";
import { ApplicationModel } from "./ApplicationModel";
import { EmailService } from "src/services/EmailService";
import { SendEmailDto } from "src/services/EmailService";
import { StudentModel } from "./StudentModel";
import { UserModel } from "./UserModel";

@Table({
  tableName: "Job",
})
export class JobModel extends Model<JobModel> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  id: string;

  @ForeignKey(() => SeasonModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  seasonId: string;

  // Delete Job onDelete of Season
  @BelongsTo(() => SeasonModel, {
    foreignKey: "seasonId",
    onDelete: "CASCADE",
  })
  season: SeasonModel;

  @ForeignKey(() => RecruiterModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  recruiterId: string;

  // Restrict Job Delete onDelete of Recruiter
  @BelongsTo(() => RecruiterModel, {
    foreignKey: "recruiterId",
    onDelete: "RESTRICT",
  })
  recruiter: RecruiterModel;

  @ForeignKey(() => CompanyModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  companyId: string;

  // Delete Job onDelete of Company
  @BelongsTo(() => CompanyModel, {
    foreignKey: "companyId",
    onDelete: "RESTRICT",
  })
  company: CompanyModel;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  role: string;

  @Column(sequelize.STRING)
  others?: string;

  @Column({
    type: sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  active: boolean;

  @Column({
    type: sequelize.ENUM(...Object.values(JobStatusTypeEnum)),
    allowNull: false,
    defaultValue: JobStatusTypeEnum.INITIALIZED,
  })
  currentStatus: JobStatusTypeEnum;

  @Column({
    type: sequelize.JSONB,
    defaultValue: Sequelize.literal("'{}'::jsonb"),
  })
  companyDetailsFilled: object;

  @Column({
    type: sequelize.JSONB,
    defaultValue: Sequelize.literal("'{}'::jsonb"),
  })
  recruiterDetailsFilled: object;

  @Column({
    type: sequelize.JSONB,
    defaultValue: Sequelize.literal("'{}'::jsonb"),
  })
  selectionProcedure: object;

  @Column({
    type: sequelize.STRING,
  })
  description?: string;

  @Column({
    type: sequelize.STRING,
  })
  attachment?: string;

  @Column({
    type: sequelize.STRING,
  })
  skills?: string;

  @Column({
    type: sequelize.STRING,
    allowNull: false,
  })
  location: string;

  @Column({
    type: sequelize.INTEGER,
  })
  noOfVacancies?: number;

  @Column({
    type: sequelize.DATE,
  })
  offerLetterReleaseDate?: Date;

  @Column({
    type: sequelize.DATE,
  })
  joiningDate?: Date;

  @Column({
    type: sequelize.INTEGER,
  })
  duration?: number;

  @Column({
    type: sequelize.TEXT({ length: "long" }),
  })
  feedback?: string;

  //Delete Job Coordinators onDelete of Job.
  @HasMany(() => JobCoordinatorModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  jobCoordinators: JobCoordinatorModel[];

  // Delete Events onDelete of Job
  @HasMany(() => EventModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  events: EventModel[];

  // Delete Salary onDelete of Job
  @HasMany(() => SalaryModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  salaries: SalaryModel[];

  @HasMany(() => ApplicationModel, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
  })
  applications: ApplicationModel[];

  @AfterCreate
  static async sendEmailHook(instance: JobModel) {
    console.log("New entry created");
    const mailerService = new EmailService();

    const dto: SendEmailDto = {
      from: { name: "TPC Portal", address: "aryangkulkarni@gmail.com" },
      recepients: [{ address: "me210003016@iiti.ac.in" }], // Put your email address for testing
      subject: "Test email",
      html: "<p>New job entry was created</p>",
    };

    // Send email
    await mailerService.sendEmail(dto);
  }

  @BeforeBulkUpdate
  static async sendEmailOnEventChange(options: any) {
    const jobs = await JobModel.findAll({ where: options.where });
    // console.log("Before Update Called");
    for (const job of jobs) {
      const previousActive = job.active;
      const newActive = options.attributes.active;

      if (previousActive === false && newActive === true) {
        // console.log("Before Update - Sending Email for Job ID: ", job.id);

        const mailerService = new EmailService();

        const students: StudentModel[] = await StudentModel.findAll();
        const salaries = await SalaryModel.findAll({
          where: {
            jobId: job.id,
          },
        });
        const eligibleStudents = new Set<StudentModel>();
        console.log("salaries", salaries);

        // Iterate over each salary and filter students
        for (const salary of salaries) {
          students.forEach((student) => {
            if (
              student.cpi >= salary.minCPI &&
              salary.programs.includes(student.programId) &&
              salary.categories.includes(student.category) &&
              salary.genders.includes(student.gender) &&
              student.tenthMarks >= salary.tenthMarks &&
              student.twelthMarks >= salary.twelthMarks
            ) {
              console.log("student added", student.id);
              eligibleStudents.add(student);
            }
          });
        }

        // console.log("eligible Students ", eligibleStudents);

        // Prepare and send the email data
        for (const student of eligibleStudents) {
          const user = await UserModel.findByPk(student.userId);
          const data: SendEmailDto = {
            from: { name: "TPC Portal", address: "aryangkulkarni@gmail.com" },
            // recepients: [{ address: "me210003016@iiti.ac.in" }], // Put your email address for testing
            recepients: [{ address: user.email }],
            subject: "Event Change Notification",
            html: `Dear ${user.name},\nThe event associated with your application ID ${job.id} has been changed.`,
          };

          await mailerService.sendEmail(data);
        }
      }
    }
  }
}

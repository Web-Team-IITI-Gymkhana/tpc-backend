import { ArgumentMetadata, Injectable, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Student } from "../../db/models/student";
import { studentDto } from "./dto/student.dto";
import { Member } from "src/db/models/member";
import { Role } from "src/db/enums/role.enum";
import { Sequelize } from "sequelize-typescript";
import { studentSearchDto } from "./dto/studentSearch.dto";
import { json } from "sequelize";
import { studentUpdateDto } from "./dto/studentUpdate.dto";
import { randomUUID } from "crypto";
import { studentDeleteDto } from "./dto/studentDelete.dto";

@Injectable()
export class studentService {
  configService: any;
  constructor(
    private config: ConfigService,
    private sequelize: Sequelize
  ) {}

  async createStudent(student: studentDto): Promise<any> {
    const t = await this.sequelize.transaction();
    try {
      const {
        name,
        category,
        gender,
        branch,
        contact,
        graduationYear,
        currentCPI,
        totalPenalty,
        rollNo,
        resume,
        email,
      } = student;
      // inserting students in the member
      const [statusFound, created] = await Member.findOrCreate({
        where: { email },
        defaults: { name, email, contact, role: Role.STUDENT },
        transaction: t,
      });

      if (!created) {
        // updating both member and student bcoz they already exists
        const [rowsUpdated, [updatedEntity]] = await Member.update(
          { name, role: Role.STUDENT, email, contact },
          {
            where: { email },
            returning: true,
            transaction: t,
          }
        );
        const [rowsUpdated1, [newstudent]] = await Student.update(
          {
            name,
            category,
            gender,
            branch,
            graduationYear,
            currentCPI,
            totalPenalty,
            rollNo,
            resume,
          },
          // studentEntry,
          {
            where: { memberId: updatedEntity.id },
            returning: true,
            transaction: t,
          }
        );
        await t.commit();
        return { data: newstudent, status: 200 };
      } else {
        // creating new student
        const newstudent = await Student.create(
          {
            memberId: statusFound.id,
            name,
            category,
            gender,
            branch,
            graduationYear,
            currentCPI,
            totalPenalty,
            rollNo,
            resume,
          },
          { transaction: t }
        );
        await t.commit();
        return { data: newstudent, status: 200 };
      }
    } catch (err) {
      t.rollback();
      throw err;
    }
  }
  async create(students: studentDto[]): Promise<any> {
    const notDone = [];
    const errors = [];
    const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });
    const metadata: ArgumentMetadata = {
      type: "body",
      metatype: studentDto,
      data: "",
    };

    try {
      const createStudentPromises = students.map(async (student: studentDto) => {
        try {
          const validatedStudent = await validationPipe.transform(student, metadata);
          const ans = await this.createStudent(validatedStudent);
          return ans;
        } catch (err) {
          notDone.push(student);
          errors.push(err);
          throw err;
        }
      });

      const createdStudents = await Promise.allSettled(createStudentPromises);
      for (const student of createdStudents) {
        if (student.status == "rejected") {
          throw student.reason;
        }
      }
      return { status: 200 };
    } catch (error) {
      return {
        status: 400,
        rolledBackQueries: notDone,
        error: errors,
      };
    }
  }

  queryBuilder = (params) => {
    let studentQuery: any = {},
      memberQuery: any = {};
    if (params.name) {
      memberQuery.name = params.name;
      studentQuery.name = params.name;
    }
    if (params.email) {
      memberQuery.email = params.email;
    }
    if (params.contact) {
      memberQuery.contact = params.contact;
    }
    if (params.gender) {
      studentQuery.gender = params.gender;
    }
    if (params.graduationYear) {
      studentQuery.graduationYear = params.graduationYear;
    }
    if (params.resume) {
      studentQuery.resume = params.resume;
    }
    if (params.totalPenalty) {
      studentQuery.totalPenalty = params.totalPenalty;
    }
    if (params.rollNo) {
      studentQuery.rollNo = params.rollNo;
    }
    if (params.category) {
      studentQuery.category = params.category;
    }
    if (params.branch) {
      studentQuery.branch = params.branch;
    }
    return { studentQuery, memberQuery };
  };

  async get(searchParams: studentSearchDto): Promise<any> {
    try {
      const { name, category, gender, branch, graduationYear, contact, currentCPI, totalPenalty, rollNo, email } =
        searchParams;
      const { studentQuery, memberQuery } = this.queryBuilder(searchParams);
      const result = await Student.findAll({
        where: studentQuery,
        include: {
          model: Member,
          where: memberQuery,
          required: true,
        },
      });
      return { status: 200, data: result };
    } catch (error) {
      console.log(error);
      return { status: 400, error: error };
    }
  }

  async updateStudent(student: studentUpdateDto) {
    const t = await this.sequelize.transaction();
    try {
      const memberId = student.memberId;
      const updateParams: studentSearchDto = student.update;
      const { studentQuery, memberQuery } = this.queryBuilder(updateParams);
      const result1 = Student.update(studentQuery, {
        where: { memberId: memberId },
        transaction: t,
      });
      const result2 = Member.update(memberQuery, {
        where: { id: memberId },
        transaction: t,
      });
      const ans = await Promise.all([result1, result2]);
      await t.commit();
      return ans;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async update(students: studentUpdateDto[]): Promise<any> {
    const notDone = [];
    const errors = [];
    const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });
    const metadata: ArgumentMetadata = {
      type: "body",
      metatype: studentUpdateDto,
      data: "",
    };
    try {
      const createStudentPromises = students.map(async (student: studentUpdateDto) => {
        try {
          const validatedStudent = await validationPipe.transform(student, metadata);
          const ans = await this.updateStudent(validatedStudent);
          return ans;
        } catch (err) {
          notDone.push(student);
          errors.push(err);
          throw err;
        }
      });
      const updatedStudents = await Promise.allSettled(createStudentPromises);
      for (const student of updatedStudents) {
        if (student.status == "rejected") {
          throw student.reason;
        }
      }
      return { status: 200 };
    } catch (error) {
      return { status: 400, rolledBackQueries: notDone, error: errors };
    }
  }

  async delete(students: String[]) {
    const notDone = [];
    const errors = [];
    const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });
    const metadata: ArgumentMetadata = {
      type: "body",
      metatype: studentDeleteDto,
      data: "",
    };
    try {
      const deleteStudents = students.map(async (student) => {
        try {
          const validatedStudent = await validationPipe.transform(student, metadata);
          const ans = await Student.destroy({
            where: { memberId: validatedStudent.id },
          });
        } catch (err) {
          notDone.push(student);
          errors.push(err);
          throw err;
        }
      });
      const deletedStudents = await Promise.allSettled(deleteStudents);
      if (errors.length) {
        throw "error";
      }
      return { status: 200 };
    } catch (err) {
      return { status: 400, notDone: notDone, error: errors };
    }
  }
}

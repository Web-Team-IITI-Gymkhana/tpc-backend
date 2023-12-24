import { Inject, Injectable, Logger } from "@nestjs/common";
import { omit } from "lodash";
import { Transaction } from "sequelize";
import { STUDENT_DAO } from "src/constants";
import { StudentModel } from "src/db/models";
import { Student } from "src/entities/Student";

@Injectable()
class StudentService {
  private logger = new Logger(StudentService.name);

  constructor(@Inject(STUDENT_DAO) private studentRepo: typeof StudentModel) {}

  async createStudent(student: Student, t?: Transaction) {
    const studentModel = await this.studentRepo.create(omit(student, "user"), { transaction: t });
    return Student.fromModel(studentModel);
  }

  async deleteStudent(studentId: string, t?: Transaction) {
    await this.studentRepo.destroy({ where: { id: studentId }, transaction: t });
  }
}

export default StudentService;

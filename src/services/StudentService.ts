import { Inject, Injectable, Logger } from "@nestjs/common";
import { omit } from "lodash";
import { Transaction, WhereOptions } from "sequelize";
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

  async getOrCreateStudent(student: Student, t?: Transaction) {
    const [studentModel] = await this.studentRepo.findOrCreate({
      where: { userId: student.userId, rollNo: student.rollNo },
      defaults: omit(student, "user"),
      transaction: t,
    });
    return Student.fromModel(studentModel);
  }

  async addStudents(students?: Student[], t?: Transaction) {
    const studentModels = await this.studentRepo.bulkCreate(
      students.map((student) => omit(student, "user")),
      { transaction: t }
    );
    return studentModels.map((studentModel) => Student.fromModel(studentModel));
  }

  async getStudents(where?: WhereOptions<StudentModel>, t?: Transaction) {
    const studentModels = await this.studentRepo.findAll({ where: where, transaction: t });
    return studentModels.map((studentModel) => Student.fromModel(studentModel));
  }

  async deleteStudent(studentId: string, t?: Transaction) {
    return !!(await this.studentRepo.destroy({ where: { id: studentId }, transaction: t }));
  }

  async updateStudent(studentId: string, fieldsToUpdate: object, t?: Transaction) {
    const [_, updatedModel] = await this.studentRepo.update(fieldsToUpdate, {
      where: { id: studentId },
      returning: true,
      transaction: t,
    });
    return Student.fromModel(updatedModel[0]);
  }
}

export default StudentService;

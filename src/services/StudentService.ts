import { Inject, Injectable, Logger } from "@nestjs/common";
import { omit } from "lodash";
import { Transaction, WhereOptions } from "sequelize";
import { COMPANY_DAO, STUDENT_DAO, USER_DAO } from "src/constants";
import { ProgramModel, StudentModel, UserModel } from "src/db/models";
import { Student } from "src/entities/Student";
import { getQueryValues } from "src/utils/utils";

@Injectable()
class StudentService {
  private logger = new Logger(StudentService.name);

  constructor(@Inject(STUDENT_DAO) private studentRepo: typeof StudentModel,
              @Inject(USER_DAO) private userRepo: typeof UserModel) { }

  async createStudents(data, t?: Transaction) {
    const students = await this.studentRepo.bulkCreate(data, {
      include: {
        model: UserModel,
        as: 'user'
      },
      transaction: t,
    });
    return students;
  }

  async getStudents(filters, options) {
    console.log(filters);
    const restrictions = {
      where: filters[0],
      include: [{
        model: UserModel,
        as: 'user',
        where: filters[1],
        required: true,
      },{
        model: ProgramModel,
        as: 'program',
        where: filters[2],
        required: true,
      }],
    };
    Object.assign(restrictions, options);
    console.log(restrictions);
    const students = await this.studentRepo.findAll(restrictions);
    return students;
  }

  async updateStudent(studentData) {
    const ans = await this.studentRepo.update(studentData,{
      where: { id: studentData.id},
      returning: true,
    });
    return ans;
  }
}

export default StudentService;

import { HttpException, Inject, Injectable, Logger } from "@nestjs/common";
import { omit } from "lodash";
import { Op, Transaction, WhereOptions } from "sequelize";
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

  async updateStudent(data) {
    const studentData = data[0], userData = data[1];
    const student = await this.getStudents([{id: studentData.id}, {}, {}], {});
    if(!student || !student[0])      throw new HttpException(`The Student with id: ${studentData.id} doesnt exist`, 404);
    //Find the student.
    let studentAns = student[0], userAns = student[0].user;
    const [cnt, newStudents] = await this.studentRepo.update(studentData, {
      where: {id: studentData.id},
      returning: true,
    });
    if(cnt)             studentAns = newStudents[0];
    //Update the student Table.
    const [cnt1, newUser] = await this.userRepo.update(userData, {
      where: {id: studentAns.userId},
      returning: true,
    });
    if(cnt1)            userAns = newUser[0];
    studentAns.user = userAns;
    //Update the user Table.
    return Student.fromModel(studentAns); 
    //This is why entity is needed.
    //Otherwise user doesnt come in the output.
  }

  async deleteStudents(ids) {
    const ans = await this.userRepo.destroy({
      where: {id: ids}
    });
    //Works because of the way the tables are designed: Cascading delete.
    return ans;
  }
}

export default StudentService;

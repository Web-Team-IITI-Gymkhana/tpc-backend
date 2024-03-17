import { HttpException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { omit } from "lodash";
import { Op, Transaction, WhereOptions } from "sequelize";
import { COMPANY_DAO, STUDENT_DAO, USER_DAO } from "src/constants";
import { PenaltyModel, ProgramModel, ResumeModel, StudentModel, UserModel } from "src/db/models";
import { Student } from "src/entities/Student";
import { getQueryValues } from "src/utils/utils";

@Injectable()
class StudentService {
  private logger = new Logger(StudentService.name);

  constructor(@Inject(STUDENT_DAO) private studentRepo: typeof StudentModel,
              @Inject(USER_DAO) private userRepo: typeof UserModel) { }

  async createStudents(data, t?: Transaction) : Promise<Student[]> {
    const students = await this.studentRepo.bulkCreate(data, {
      include: {
        model: UserModel,
        as: 'user'
      },
      transaction: t,
    });
    return students.map((student) => Student.fromModel(student));
  }

  async getStudents(filters, options) : Promise<Student[]> {
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
    
    const students = await this.studentRepo.findAll(restrictions);
    return students.map((student) => Student.fromModel(student));
  }

  async getStudent(id: string, t?: Transaction) : Promise<Student> {
    const student = await this.studentRepo.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: 'user',
        },
        {
          model: ProgramModel,
          as: 'program',
        },
        {
          model: ResumeModel,
          as: 'resumes',
        }
      ]
    });
    return Student.fromModel(student);
  }

  async updateStudent(data, t?:Transaction) : Promise<Student> {
    const studentData = data[0], userData = data[1];

    const student = await this.studentRepo.findByPk(studentData.id);
    if(!student)      throw new NotFoundException('The Student Doesnt Exist');

    const pr = [];
    pr.push(this.studentRepo.update(studentData, {
      where: { id: studentData.id },
      transaction: t,
      returning: true,
    }));
    pr.push(this.userRepo.update(userData, {
      where: { id: student.userId },
      transaction: t,
      returning: true,
    }));
    const [[_, [newStudent]], [__, [user]]] = await Promise.all(pr);
    newStudent.user = user;

    return Student.fromModel(newStudent); 
  }

  async deleteStudents(ids: string[] | string) : Promise<Number> {
    const ans = await this.userRepo.destroy({
      where: {id: ids}
    });
    return ans;
  }
}

export default StudentService;

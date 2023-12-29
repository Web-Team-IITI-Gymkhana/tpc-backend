import {
  Controller,
  Inject,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Delete,
  Param,
  Put,
} from "@nestjs/common";
import { STUDENT_SERVICE, USER_SERVICE } from "src/constants";
import StudentService from "src/services/StudentService";
import { AddStudentsDto, GetStudentQueryDto, UpdateStudentDto, studentIdParamDto } from "../dtos/student";
import { Student } from "src/entities/Student";
import UserService from "src/services/UserService";
import { User } from "src/entities/User";
import { Role } from "src/db/enums";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@Controller("/students")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class StudentController {
  constructor(
    @Inject(STUDENT_SERVICE) private studentService: StudentService,
    @Inject(USER_SERVICE) private userService: UserService
  ) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getStudents(@Query() query: GetStudentQueryDto) {
    const students = await this.studentService.getStudents({
      id: query.id,
      userId: query.userId,
      category: query.category,
      gender: query.gender,
      programId: query.programId,
    });
    return { students: students };
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async addStudents(@Body() body: AddStudentsDto, @TransactionParam() transaction: Transaction) {
    const promises = [];
    for (const student of body.students) {
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
            const user = await this.userService.getOrCreateUser(
              new User({ name: student.name, email: student.email, contact: student.contact, role: Role.STUDENT }),
              transaction
            );
            const newStudent = await this.studentService.getOrCreateStudent(
              new Student({
                userId: user.id,
                rollNo: student.rollNo,
                category: student.category,
                gender: student.gender,
                programId: student.programId,
              }),
              transaction
            );
            newStudent.user = user;
            resolve(newStudent);
          } catch (err) {
            reject(err);
          }
        })
      );
    }
    const students = await Promise.all(promises);
    return { students: students };
  }

  @Put("/:studentId")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async updateStudent(
    @Param() param: studentIdParamDto,
    @Body() body: UpdateStudentDto,
    @TransactionParam() transaction: Transaction
  ) {
    const newstudent = await this.studentService.updateStudent(param.studentId, body, transaction);
    const newUser = await this.userService.updateUser(newstudent.userId, body, transaction);
    newstudent.user = newUser;
    return { student: newstudent };
  }

  @Delete("/:studentId")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async deletePenalty(@Param() param: studentIdParamDto, @TransactionParam() transaction: Transaction) {
    const userId = await this.studentService.deleteStudent(param.studentId, transaction);
    const userDeleted = await this.userService.deleteUser(userId, transaction);
    return { deleted: userDeleted };
  }
}

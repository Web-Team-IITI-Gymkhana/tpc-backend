import {
  Controller,
  Inject,
  UseInterceptors,
  Get,
  Post,
  Query,
  Body,
  Delete,
  Param,
  Patch,
  ParseArrayPipe,
  ValidationPipe,
  UseGuards,
} from "@nestjs/common";
import { STUDENT_SERVICE } from "src/constants";
import StudentService from "src/services/StudentService";
import { Role } from "src/db/enums";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { ApiBearerAuth } from "@nestjs/swagger";
import {  bulkOperate, conformToModel, find_order, makeFilter, optionsFactory } from "src/utils/utils";
import { ProgramModel, StudentModel, UserModel } from "src/db/models";
import { QueryInterceptor } from "src/interceptor/QueryInterceptor";
import { CreateStudentDto, CreateStudentReturnDto, DeleteStudentQueryDto, GetStudentReturnDto, GetStudentsReturnDto, UpdateStudentDto, WhereOptionsDto } from "src/dtos/student";
import { AuthGuard } from "@nestjs/passport";

@Controller("/students")
@ApiBearerAuth("jwt")
// @UseGuards(AuthGuard("jwt"))
export class StudentController {
  constructor(
    @Inject(STUDENT_SERVICE) private studentService: StudentService,
  ) {}

  //Template Starts.

  /**  This is how I think a generalized template would look like.
   *   We can thrash this and go for hardcoding the values also.
   *   The main advantage this gives are the utils functions which can help us by removing the part where we hardcode the mappings.
   *   Especially in GET.
   *   This is not tested throughly, please do so before approval.
   *   Nested values are passed into query by using underscores.
   *   eg: {
   *            "user": {
   *                "userId": "abc",
   *            }
   *        }
   *      is Represented as: {
   *                                user_userId: "abc"
   *                          }
   */

  @Get()
  @UseInterceptors(QueryInterceptor)
  async getStudents(@Query() where: WhereOptionsDto) : Promise<GetStudentsReturnDto[]> {
    const models = [StudentModel, UserModel, ProgramModel];
    const alias = ["", "user", "program"];
    const filterBy = where.filterBy || {};
    const orders = where.orderBy || {};
    const options = optionsFactory(where.from, where.to);
    const filters = [];

    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      filters.push(makeFilter(conformToModel(filterBy, model, i==0)));
      const orderBy = conformToModel(orders, model, i==0);
      if (Object.keys(orderBy).length) {
        const res = find_order(orderBy, model);
        options["order"] = [[{ model: model, as: alias[i] }, res[0], res[1]]];
      }
    }

    if (options["order"] && options["order"][0][0]["as"] == "")    
          options["order"][0] = [options["order"][0][1], options["order"][0][2]];
    
    
    const ans = await this.studentService.getStudents(filters, options);
    const pipe = new ParseArrayPipe({
      whitelist: true,
      items: GetStudentsReturnDto
    });

    return pipe.transform(ans, {
      type: 'body'
    });
  }

  @Get('/:id')
  async getStudent(@Param('id') id: string) : Promise<GetStudentReturnDto>  {
    const ans = await this.studentService.getStudent(id);
    const pipe = new ValidationPipe({
      transform: true,
      whitelist: true,
      expectedType: GetStudentReturnDto,
    });

    return pipe.transform(ans, {
      type: 'body'
    });
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async createStudents(
    @Body(new ParseArrayPipe({ items: CreateStudentDto })) body: CreateStudentDto[],
    @TransactionParam() transaction: Transaction
  ) : Promise<CreateStudentReturnDto[]> {
    const data = [];
    for (const student of body) {
      student["role"] = Role.STUDENT;
      const stud = conformToModel(student, StudentModel, 1);
      const user = conformToModel(student, UserModel, 0);
      stud["user"] = user;
      data.push(stud);
    }

    const ans = await this.studentService.createStudents(data, transaction);
    const pipe = new ParseArrayPipe({
      items: CreateStudentReturnDto,
      whitelist: true,
    });
    
    return pipe.transform(ans, {
      type: 'body'
    });
  }

  /**  The body is an array of the form: 
   * {
   *    fieldToBeUpdated: newValue.
   * }
   * Id is also passed along for searching the student.
   */
  @Patch()
  @UseInterceptors(TransactionInterceptor)
  async updateStudents(@Body(new ParseArrayPipe({ items: UpdateStudentDto })) body: UpdateStudentDto[], @TransactionParam() t: Transaction) {
    const data = [];
    for(const value of body) {
      const student = conformToModel(value, StudentModel, 1);
      const user = conformToModel(value, UserModel, 0);
      const updateValues = [student, user];
      data.push(updateValues);
    }
    const ans = await bulkOperate(this.studentService, 'updateStudent', data, t);
    return ans;
  }

  /**
   * The query is of the form:
   * {
   *    userId: array of userIds.
   * }
   */
  @Delete()
  async deleteStudents(@Query() query: DeleteStudentQueryDto) : Promise<Number> {
    return this.studentService.deleteStudents(query.userId);
  }
  
  //Template Ends.
}

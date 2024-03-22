import {
  Controller,
  Get,
  Query,
  Post,
  Patch,
  Delete,
  Param,
  ParseUUIDPipe,
  ParseArrayPipe,
  Body,
  UseInterceptors,
} from "@nestjs/common";
import { StudentService } from "./student.service";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { GetStudentQueryDto } from "./dtos/studentGetQuery.dto";
import { QueryInterceptor } from "src/interceptor/QueryInterceptor";
import { ApiFilterQuery, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { GetStudentReturnDto, GetStudentsReturnDto } from "./dtos/studentGetReturn.dto";
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateStudentDto } from "./dtos/studentPost.dto";
import { Role } from "src/enums";
import { UpdateStudentDto } from "./dtos/studentPatch.dto";

@Controller("students")
@ApiTags("Student Handler for Admin side")
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  @ApiOperation({
    description:
      // eslint-disable-next-line max-len
      "Refer the object in q but after making the object using nested json seperate it by underscores and send it. Dont try using swagger wont work. Dont forge to add q to the nested json as so: {q:{}}",
  })
  @ApiFilterQuery("q", GetStudentQueryDto)
  @ApiResponse({ type: GetStudentsReturnDto, isArray: true })
  @UseInterceptors(QueryInterceptor)
  async getStudents(@Query("q") where: GetStudentQueryDto) {
    const ans = await this.studentService.getStudents(where);

    return pipeTransformArray(ans, GetStudentsReturnDto);
  }

  @Get("/:id")
  @ApiResponse({ type: GetStudentReturnDto })
  async getStudent(@Param("id", new ParseUUIDPipe()) id: string) {
    const ans = await this.studentService.getStudent(id);

    return pipeTransform(ans, GetStudentReturnDto);
  }

  @Post()
  @ApiResponse({ type: String, isArray: true, description: "Array of ids" })
  @ApiBody({ type: CreateStudentDto, isArray: true })
  async createStudents(
    @Body(new ParseArrayPipe({ items: CreateStudentDto })) body: CreateStudentDto[]
  ): Promise<string[]> {
    const students = body.map((data) => {
      data.user.role = Role.STUDENT;

      return data;
    });
    const ans = await this.studentService.createStudents(students);

    return ans;
  }

  @Patch()
  @UseInterceptors(TransactionInterceptor)
  @ApiBody({ type: UpdateStudentDto, isArray: true })
  async updateStudents(
    @Body(new ParseArrayPipe({ items: UpdateStudentDto })) body: UpdateStudentDto[],
    @TransactionParam() t: Transaction
  ) {
    const pr = body.map((data) => this.studentService.updateStudent(data, t));
    const ans = await Promise.all(pr);

    return ans;
  }

  @Delete()
  @ApiQuery({ name: "id", type: String, isArray: true })
  @UseInterceptors(TransactionInterceptor)
  async deleteStudents(@Query("id") ids: string | string[], @TransactionParam() t: Transaction) {
    const pids = typeof ids === "string" ? [ids] : ids;
    const pr = pids.map((id) => this.studentService.deleteStudent(id, t));
    const ans = await Promise.all(pr);

    return ans;
  }
}

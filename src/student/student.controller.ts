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
  UseGuards,
  Req,
} from "@nestjs/common";
import { StudentService } from "./student.service";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { GetStudentQueryDto } from "./dtos/studentGetQuery.dto";
import { QueryInterceptor } from "src/interceptor/QueryInterceptor";
import { ApiFilterQuery, createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { GetStudentReturnDto, GetStudentsReturnDto } from "./dtos/studentGetReturn.dto";
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateStudentDto } from "./dtos/studentPost.dto";
import { RoleEnum } from "src/enums";
import { UpdateStudentDto } from "./dtos/studentPatch.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("students")
@ApiTags("Student")
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  @ApiOperation({
    description: "Please Refer to the GetStudentQueryDto for the Schema Ctrl+F it.",
  })
  @ApiFilterQuery("q", GetStudentQueryDto)
  @ApiResponse({ type: GetStudentsReturnDto, isArray: true })
  async getStudents(@Query("q") where: GetStudentQueryDto, @Req() request) {
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
  async createStudents(@Body(createArrayPipe(CreateStudentDto)) body: CreateStudentDto[]): Promise<string[]> {
    const students = body.map((data) => {
      data.user.role = RoleEnum.STUDENT;

      return data;
    });
    const ans = await this.studentService.createStudents(students);

    return ans;
  }

  @Patch()
  @UseInterceptors(TransactionInterceptor)
  @ApiBody({ type: UpdateStudentDto, isArray: true })
  async updateStudents(
    @Body(createArrayPipe(UpdateStudentDto)) body: UpdateStudentDto[],
    @TransactionParam() t: Transaction
  ) {
    const pr = body.map((data) => this.studentService.updateStudent(data, t));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @Delete()
  @ApiQuery({ name: "id", type: String, isArray: true })
  async deleteStudents(@Query("id") ids: string | string[]) {
    const pids = typeof ids === "string" ? [ids] : ids;

    return await this.studentService.deleteStudents(pids);
  }
}

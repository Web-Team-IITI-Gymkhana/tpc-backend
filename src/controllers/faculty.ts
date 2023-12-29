import {
  Body,
  Controller,
  Inject,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from "@nestjs/common";
import { RECRUITER_SERVICE, USER_SERVICE } from "src/constants";
import FacultyService from "src/services/FacultyService";
import UserService from "src/services/UserService";
import { Faculty } from "src/entities/Faculty";
import { AddFacultyDto, FacultyIdParamDto, GetFacultyDto, UpdateFacultyDto } from "../dtos/faculty";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { User } from "src/entities/User";
import { Role } from "src/db/enums";
import { CompanyIdParamDto } from "src/dtos/company";

@Controller("faculty")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class FacultyController {
  constructor(
    @Inject(RECRUITER_SERVICE) private facultyService: FacultyService,
    @Inject(USER_SERVICE) private userService: UserService
  ) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getFacultys(@Query() query: GetFacultyDto) {
    const faculty = await this.facultyService.getFaculty({
      id: query.id,
      department: query.department,
    });
    return { faculty: faculty };
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async addFacultys(@Body() body: AddFacultyDto, @TransactionParam() transaction: Transaction) {
    const user = await this.userService.getOrCreateUser(
      new User({ name: body.name, email: body.email, contact: body.contact, role: Role.FACULTY }),
      transaction
    );

    const newFaculty = await this.facultyService.createFaculty(
      new Faculty({
        userId: user.id,
        department: body.department,
      }),
      transaction
    );
    newFaculty.user = user;

    return { faculty: newFaculty };
  }

  @Put("/:facultyId")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async updateStudent(
    @Param() param: FacultyIdParamDto,
    @Body() body: UpdateFacultyDto,
    @TransactionParam() transaction: Transaction
  ) {
    const newFaculty = await this.facultyService.updateFaculty(param.facultyId, body, transaction);
    const newUser = await this.userService.updateUser(newFaculty.userId, body, transaction);
    newFaculty.user = newUser;
    return { faculty: newFaculty };
  }

  @Delete("/:facultyId")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async deletePenalty(@Param() param: FacultyIdParamDto, @TransactionParam() transaction: Transaction) {
    const userId = await this.facultyService.deleteFaculty(param.facultyId, transaction);
    const userDeleted = await this.userService.deleteUser(userId, transaction);
    return { deleted: userDeleted };
  }
}

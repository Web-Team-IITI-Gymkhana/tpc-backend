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
import { FACULTY_SERVICE, USER_SERVICE } from "src/constants";
import FacultyService from "src/services/FacultyService";
import UserService from "src/services/UserService";
import { Faculty } from "src/entities/Faculty";
import { CreateFacultiesDto, FacultyIdParamDto, GetFacultyDto, UpdateFacultyDto } from "../dtos/faculty";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { User } from "src/entities/User";
import { Role } from "src/db/enums";
import { CompanyIdParamDto } from "src/dtos/company";
import { HttpException } from "@nestjs/common/exceptions";
import { HttpStatus } from "@nestjs/common/enums";
import { UpdateOrFind } from "src/utils/utils";


@Controller("faculty")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class FacultyController {
  constructor(
    @Inject(FACULTY_SERVICE) private facultyService: FacultyService,
    @Inject(USER_SERVICE) private userService: UserService
  ) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getFaculties(@Query() query: GetFacultyDto) {
    const faculties = await this.facultyService.getFaculties({
      id: query.id,
      userId: query.userId,
      department: query.department,
    },
    {
      id: query.userId,
      name: query.name,
      email: query.email,
      contact: query.contact,
    });
    return { faculties: faculties };
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async createFaculties(@Body() body: CreateFacultiesDto, @TransactionParam() transaction: Transaction) {
    const promises = [];
    for (const faculty of body.faculties) {
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
            const user = await this.userService.getOrCreateUser(
              new User({ name: faculty.name, email: faculty.email, contact: faculty.contact, role: Role.FACULTY }),
              transaction
            );

            const newFaculty = await this.facultyService.getOrCreateFaculty(
              new Faculty({
                userId: user.id,
                department: faculty.department,
              }),
              transaction
            );
            newFaculty.user = user;

            resolve(newFaculty);
          } catch (err) {
            reject(err);
          }
        })
      );
    }

    const faculties = await Promise.all(promises);
    return { faculties: faculties };
  }

  querybuilder(params) {
    let Faculty = {};
    let User = {};
    if (params.department) {
      Faculty[`department`] = params.department;
    }
    if (params.name) {
      User['name'] = params.name;
    }
    if (params.email) {
      User['email'] = params.email;
    }
    if (params.contact) {
      User['contact'] = params.contact;
    }
    if (params.role) {
      User['role'] = params.role;
    }

    return { Faculty, User };
  }

  @Put("/:facultyId")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async updateFaculty(
    @Param() param: FacultyIdParamDto,
    @Body() body: UpdateFacultyDto,
    @TransactionParam() transaction: Transaction
  ) {
    const [faculty] = await this.facultyService.getFaculties({
      id: param.facultyId,
    });
    if (!faculty) {
      throw new HttpException(`Faculty with FacultyId: ${param.facultyId} not found`, HttpStatus.NOT_FOUND);
    }
    const { Faculty, User } = this.querybuilder(body);
    const newFaculty = await UpdateOrFind(
      param.facultyId,
      Faculty,
      this.facultyService,
      "updateFaculty",
      "getFaculties",
      transaction
    );
    const newUser = await UpdateOrFind(newFaculty.userId, User, this.userService, "updateUser", "getUserById",transaction);
    newFaculty.user = newUser;
    return { faculty: newFaculty };
  }

  @Delete("/:facultyId")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async deleteFaculty(@Param() param: FacultyIdParamDto, @TransactionParam() transaction: Transaction) {
    const [faculty] = await this.facultyService.getFaculties({
      id: param.facultyId,
    });
    if (!faculty) {
      throw new HttpException(`Faculty with FacultyId: ${param.facultyId} not found`, HttpStatus.NOT_FOUND);
    }
    const userId = faculty.userId;
    const facultydeleted = await this.facultyService.deleteFaculty(param.facultyId, transaction);
    const userDeleted = await this.userService.deleteUser(userId, transaction);
    return { deleted: userDeleted&&facultydeleted };
  }
}

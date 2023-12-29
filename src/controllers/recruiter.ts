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
} from "@nestjs/common";
import { RECRUITER_SERVICE, USER_SERVICE } from "src/constants";
import RecruiterService from "src/services/RecruiterService";
import UserService from "src/services/UserService";
import { Recruiter } from "src/entities/Recruiter";
import { AddRecruiterDto, RecruiterIdParamDto, UpdateRecruiterDto } from "../dtos/recruiter";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { User } from "src/entities/User";
import { Role } from "src/db/enums";
import { CompanyIdParamDto } from "src/dtos/company";

@Controller("/:companyId/recruiters")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class RecruiterController {
  constructor(
    @Inject(RECRUITER_SERVICE) private recruiterService: RecruiterService,
    @Inject(USER_SERVICE) private userService: UserService
  ) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getRecruiters(@Param() param: CompanyIdParamDto) {
    const recruiters = await this.recruiterService.getRecruiters({
      companyId: param.companyId,
    });
    return { recruiters: recruiters };
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async addRecruiter(
    @Param() param: CompanyIdParamDto,
    @Body() body: AddRecruiterDto,
    @TransactionParam() transaction: Transaction
  ) {
    const user = await this.userService.getOrCreateUser(
      new User({ name: body.name, email: body.email, contact: body.contact, role: Role.RECRUITER }),
      transaction
    );

    const newRecruiter = await this.recruiterService.createRecruiter(
      new Recruiter({
        userId: user.id,
        companyId: param.companyId,
      }),
      transaction
    );
    newRecruiter.user = user;

    return { recruiter: newRecruiter };
  }

  @Put("/:recruiterId")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async updateStudent(
    @Param() param: CompanyIdParamDto & RecruiterIdParamDto,
    @Body() body: UpdateRecruiterDto,
    @TransactionParam() transaction: Transaction
  ) {
    const newRecruiter = await this.recruiterService.updateRecruiter(param.recruiterId, body, transaction);
    const newUser = await this.userService.updateUser(newRecruiter.userId, body, transaction);
    newRecruiter.user = newUser;
    return { recruiter: newRecruiter };
  }

  @Delete("/:recruiterId")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async deletePenalty(
    @Param() param: CompanyIdParamDto & RecruiterIdParamDto,
    @TransactionParam() transaction: Transaction
  ) {
    const userId = await this.recruiterService.deleteRecruiter(param.recruiterId, transaction);
    const userDeleted = await this.userService.deleteUser(userId, transaction);
    return { deleted: userDeleted };
  }
}

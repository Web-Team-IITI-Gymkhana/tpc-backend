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
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { RECRUITER_SERVICE, USER_SERVICE } from "src/constants";
import RecruiterService from "src/services/RecruiterService";
import UserService from "src/services/UserService";
import { Recruiter } from "src/entities/Recruiter";
import { AddRecruitersDto, RecruiterIdParamDto, UpdateRecruiterDto } from "../dtos/recruiter";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { User } from "src/entities/User";
import { Role } from "src/db/enums";
import { CompanyIdParamDto } from "src/dtos/company";
import { UpdateOrFind } from "src/utils/utils";

@Controller("companies/:companyId/recruiters")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class RecruiterController {
  constructor(
    @Inject(RECRUITER_SERVICE) private recruiterService: RecruiterService,
    @Inject(USER_SERVICE) private userService: UserService
  ) { }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getRecruiters(@Param() param: CompanyIdParamDto) {
    const recruiters = await this.recruiterService.getRecruiters({
      companyId: param.companyId,
    });

    return { recruiters: recruiters };
  }

  // @Post()
  // @UseInterceptors(TransactionInterceptor)
  // @UseInterceptors(ClassSerializerInterceptor)
  // async addRecruiters(
  //   @Param() param: CompanyIdParamDto,
  //   @Body() body: AddRecruitersDto,
  //   @TransactionParam() transaction: Transaction
  // ) {
  //   const promises = [];
  //   for (const recruiter of body.recruiters) {
  //     promises.push(
  //       new Promise(async (resolve, reject) => {
  //         try {
  //           const user = await this.userService.getOrCreateUser(
  //             new User({
  //               name: recruiter.name,
  //               email: recruiter.email,
  //               contact: recruiter.contact,
  //               role: Role.RECRUITER,
  //             }),
  //             transaction
  //           );

  //           const newRecruiter = await this.recruiterService.getOrCreateRecruiter(
  //             new Recruiter({
  //               userId: user.id,
  //               companyId: param.companyId,
  //             }),
  //             transaction
  //           );
  //           newRecruiter.user = user;

  //           resolve(newRecruiter);
  //         } catch (err) {
  //           reject(err);
  //         }
  //       })
  //     );
  //   }

  //   const recruiters = await Promise.all(promises);
  //   return { recruiters: recruiters };
  // }
  @Post()
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async addRecruiters(
    @Param() param: CompanyIdParamDto,
    @Body() body: AddRecruitersDto,
    @TransactionParam() transaction: Transaction
  ) {
    const userArray = body.recruiters.map(recruiter => {
      return {
        name: recruiter.name,
        email: recruiter.email,
        contact: recruiter.contact,
        role: Role.RECRUITER,
      };
    });

    const createdUsers = await this.userService.bulkCreateUsers(userArray, transaction);

    const recruiterArray = createdUsers.map(user => {
      return {
        userId: user.id,
        companyId: param.companyId,
      };
    });

    const createdRecruiters = await this.recruiterService.bulkCreateRecruiters(recruiterArray, transaction);

    // Associate the created users with their respective recruiters
    createdRecruiters.forEach((recruiter, index) => {
      recruiter.user = createdUsers[index];
    });

    return { recruiters: createdRecruiters };
  }


  querybuilder(params) {
    let Recruiter = {};
    let User = {};
    if (params.companyId) {
      Recruiter["companyId"] = params.companyId;
    }
    if (params.name) {
      User["name"] = params.name;
    }
    if (params.email) {
      User["email"] = params.email;
    }
    if (params.contact) {
      User["contact"] = params.contact;
    }
    if (params.role) {
      User["role"] = params.role;
    }

    return { Recruiter, User };
  }

  @Put("/:recruiterId")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async updateRecruiter(
    @Param() param: CompanyIdParamDto & RecruiterIdParamDto,
    @Body() body: UpdateRecruiterDto,
    @TransactionParam() transaction: Transaction
  ) {
    const [recruiter] = await this.recruiterService.getRecruiters({
      id: param.recruiterId,
    });
    if (!recruiter) {
      throw new HttpException(`recruiter with recruiterId: ${param.recruiterId} not found`, HttpStatus.NOT_FOUND);
    }
    const { Recruiter, User } = this.querybuilder(body);
    const newRecruiter = await UpdateOrFind(
      param.recruiterId,
      Recruiter,
      this.recruiterService,
      "updateRecruiter",
      "getRecruiters",
      transaction
    );
    const newUser = await UpdateOrFind(newRecruiter.userId, User, this.userService, "updateUser", "getUserById", transaction);
    newRecruiter.user = newUser;
    return { recruiter: newRecruiter };
  }

  @Delete("/:recruiterId")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async deleteRecruiter(
    @Param() param: CompanyIdParamDto & RecruiterIdParamDto,
    @TransactionParam() transaction: Transaction
  ) {
    const [recruiter] = await this.recruiterService.getRecruiters({
      id: param.recruiterId,
    });
    if (!recruiter) {
      throw new HttpException(`recruiter with recruiterId: ${param.recruiterId} not found`, HttpStatus.NOT_FOUND);
    }
    const userId = recruiter.userId;
    const recruiterDeleted = await this.recruiterService.deleteRecruiter(param.recruiterId, transaction);
    const userDeleted = await this.userService.deleteUser(userId, transaction);
    return { deleted: userDeleted && recruiterDeleted };
  }
}

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
  Put,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { TPC_MEMBER_SERVICE, USER_SERVICE } from "src/constants";
import TpcMemberService from "src/services/TpcMemberService";
import { AddTpcMembersDto, GetTpcMemberQueryDto, TpcMemberIdParamDto, UpdateTpcMemberDto } from "../dtos/tpcMember";
import { TpcMember } from "src/entities/TpcMember";
import UserService from "src/services/UserService";
import { User } from "src/entities/User";
import { Role } from "src/db/enums";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { UpdateOrFind } from "src/utils/utils";

@Controller("/tpcMembers")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class TpcMemberController {
  constructor(
    @Inject(TPC_MEMBER_SERVICE) private tpcMemberService: TpcMemberService,
    @Inject(USER_SERVICE) private userService: UserService
  ) { }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getTpcMembers(@Query() query: GetTpcMemberQueryDto) {
    const tpcMembers = await this.tpcMemberService.getTpcMembers({
      id: query.id,
      userId: query.userId,
      role: query.role,
      department: query.department,
    },
      {
        id: query.userId,
        name: query.name,
        email: query.email,
        contact: query.contact,

      });
    for (const tpcMember of tpcMembers) {
      tpcMember.user = await this.userService.getUserById(tpcMember.userId);
    }
    return { tpcMembers: tpcMembers };
  }

  // @Post()
  // @UseInterceptors(TransactionInterceptor)
  // @UseInterceptors(ClassSerializerInterceptor)
  // async addTpcMembers(@Body() body: AddTpcMembersDto, @TransactionParam() transaction: Transaction) {
  //   const promises = [];
  //   for (const tpcMember of body.tpcMembers) {
  //     promises.push(
  //       new Promise(async (resolve, reject) => {
  //         try {
  //           const user = await this.userService.getOrCreateUser(
  //             new User({
  //               name: tpcMember.name,
  //               email: tpcMember.email,
  //               contact: tpcMember.contact,
  //               role: Role.STUDENT,
  //             }),
  //             transaction
  //           );
  //           const newTpcMember = await this.tpcMemberService.getOrCreateTpcMember(
  //             new TpcMember({
  //               userId: user.id,
  //               role: tpcMember.role,
  //               department: tpcMember.department,
  //             }),
  //             transaction
  //           );
  //           newTpcMember.user = user;
  //           resolve(newTpcMember);
  //         } catch (err) {
  //           reject(err);
  //         }
  //       })
  //     );
  //   }
  //   const tpcMembers = await Promise.all(promises);
  //   return { tpcMembers: tpcMembers };
  // }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async addTpcMembers(@Body() body: AddTpcMembersDto, @TransactionParam() transaction: Transaction) {
    const userArray = body.tpcMembers.map(tpcMember => {
      return {
        name: tpcMember.name,
        email: tpcMember.email,
        contact: tpcMember.contact,
        role: Role.STUDENT, // Assuming tpcMembers have the role STUDENT, adjust as needed
      };
    });

    const createdUsers = await this.userService.bulkCreateUsers(userArray, transaction);

    const tpcMemberArray = createdUsers.map((user, index) => {
      return {
        userId: user.id,
        role: body.tpcMembers[index].role,
        department: body.tpcMembers[index].department,
      };
    });

    const createdTpcMembers = await this.tpcMemberService.bulkCreateTpcMembers(tpcMemberArray, transaction);

    // Associate the created users with their respective tpcMembers
    createdTpcMembers.forEach((tpcMember, index) => {
      tpcMember.user = createdUsers[index];
    });

    return { tpcMembers: createdTpcMembers };
  }

  querybuilder(params) {
    let TpcMember = {};
    let User = {};

    if (params.department) {
      TpcMember[`department`] = params.department;
    }
    if (params.role) {
      TpcMember["role"] = params.Tpcrole;
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

    return { TpcMember, User };
  }

  @Put("/:tpcMemberId")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async updateTpcMember(
    @Param() param: TpcMemberIdParamDto,
    @Body() body: UpdateTpcMemberDto,
    @TransactionParam() transaction: Transaction
  ) {
    const [tpcMember] = await this.tpcMemberService.getTpcMembers({ id: param.tpcMemberId });
    if (!tpcMember) {
      throw new HttpException(`TpcMember with TpcMemberId: ${param.tpcMemberId} not found`, HttpStatus.NOT_FOUND);
    }
    const { TpcMember, User } = this.querybuilder(body);
    const newTpcMember = await UpdateOrFind(
      param.tpcMemberId,
      TpcMember,
      this.tpcMemberService,
      "updateTpcMember",
      "getTpcMembers",
      transaction
    );
    const newUser = await UpdateOrFind(newTpcMember.userId, User, this.userService, "updateUser", "getUserById", transaction);
    newTpcMember.user = newUser;
    return { tpcMember: newTpcMember };
  }

  @Delete("/:tpcMemberId")
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteTpcMember(@Param() param: TpcMemberIdParamDto) {
    const [tpcMember] = await this.tpcMemberService.getTpcMembers({ id: param.tpcMemberId });
    if (!tpcMember) {
      throw new HttpException(`TpcMember with TpcMemberId: ${param.tpcMemberId} not found`, HttpStatus.NOT_FOUND);
    }
    const deleted = await this.tpcMemberService.deleteTpcMember(param.tpcMemberId);
    //Can be a student even if he/she isnt a TPC member so not deleting from user table.
    return { deleted: deleted };
  }
}

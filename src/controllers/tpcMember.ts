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
} from "@nestjs/common";
import { TPC_MEMBER_SERVICE, USER_SERVICE } from "src/constants";
import TpcMemberService from "src/services/TpcMemberService";
import { AddTpcMembersDto, GetTpcMemberQueryDto } from "../dtos/tpcMember";
import { TpcMember } from "src/entities/TpcMember";
import UserService from "src/services/UserService";
import { User } from "src/entities/User";
import { Role } from "src/db/enums";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@Controller("/tpcMembers")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class TpcMemberController {
  constructor(
    @Inject(TPC_MEMBER_SERVICE) private tpcMemberService: TpcMemberService,
    @Inject(USER_SERVICE) private userService: UserService
  ) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getTpcMembers(@Query() query: GetTpcMemberQueryDto) {
    const tpcMembers = await this.tpcMemberService.getTpcMembers({
      id: query.id,
      userId: query.userId,
      role: query.role,
      department: query.department,
    });
    return { tpcMembers: tpcMembers };
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async addTpcMembers(@Body() body: AddTpcMembersDto, @TransactionParam() transaction: Transaction) {
    const promises = [];
    for (const tpcMember of body.tpcMembers) {
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
            const user = await this.userService.getOrCreateUser(
              new User({
                name: tpcMember.name,
                email: tpcMember.email,
                contact: tpcMember.contact,
                role: Role.STUDENT,
              }),
              transaction
            );
            const newTpcMember = await this.tpcMemberService.getOrCreateTpcMember(
              new TpcMember({
                userId: user.id,
                role: tpcMember.role,
                department: tpcMember.deparment,
              }),
              transaction
            );
            newTpcMember.user = user;
            resolve(newTpcMember);
          } catch (err) {
            reject(err);
          }
        })
      );
    }
    const tpcMembers = await Promise.all(promises);
    return { tpcMembers: tpcMembers };
  }
}

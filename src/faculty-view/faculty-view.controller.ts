import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from "@nestjs/common";
import { FacultyViewService } from "./faculty-view.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { pipeTransform, pipeTransformArray } from "src/utils/utils";
import { GetFacultyDto } from "./dto/get.dto";
import { IUser } from "src/auth/User";
import { User } from "src/decorators/User";
import { FacultyApprovalRequestsDto } from "./dto/get.dto";
import { UpdateFacultyApprovalStatusDto, UpdateFacultyDto } from "./dto/patch.dto";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { Transaction } from "sequelize";
import { TransactionParam } from "src/decorators/TransactionParam";

@Controller("faculty-view")
@UseGuards(AuthGuard("jwt"))
@ApiTags("faculty-view")
@ApiBearerAuth("jwt")
export class FacultyViewController {
  constructor(private readonly facultyViewService: FacultyViewService) {}

  @Get("faculty")
  @ApiResponse({ type: GetFacultyDto })
  async getFaculty(@User() user: IUser) {
    const ans = await this.facultyViewService.getFaculty(user.facultyId);

    return pipeTransform(ans, GetFacultyDto);
  }

  @Get("approvals")
  @ApiResponse({ type: FacultyApprovalRequestsDto, isArray: true })
  async getFacultyApprovals(@User() user: IUser) {
    const ans = await this.facultyViewService.getApprovals({ facultyId: user.facultyId });

    return pipeTransformArray(ans, FacultyApprovalRequestsDto);
  }

  @Get("enums")
  async getEnums() {
    const ans = await this.facultyViewService.getEnums();

    return ans;
  }

  @Patch("approval-status")
  async updateApprovalStatus(@Body() approval: UpdateFacultyApprovalStatusDto) {
    const result = await this.facultyViewService.updateApprovalStatus(approval);

    return result;
  }

  @Patch("faculty")
  @UseInterceptors(TransactionInterceptor)
  async updateFaculty(@Body() faculty: UpdateFacultyDto, @TransactionParam() t: Transaction) {
    const result = await this.facultyViewService.updateFaculty(faculty, t);

    return result;
  }
}

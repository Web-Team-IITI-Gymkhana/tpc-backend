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
import { FacultyApprovalService } from "./facultyApproval.service";
import { FacultyApprovalGetQueryDto } from "./dtos/facultyApprovalGetQuery.dto";
import { CreateFacultyApprovalDto } from "./dtos/facultyApprovalPost.dto";
import { UpdateFacultyApprovalDto } from "./dtos/facultyApprovalPatch.dto";
import { ApiFilterQuery } from "src/utils/utils";

import { ApiResponse, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { GetFacultyApprovalsReturnDto } from "./dtos/facultyApprovalGetReturn.dto";
import { pipeTransformArray } from "src/utils/utils";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";

@Controller("faculty-approval")
@ApiTags("Faculty Approval")
export class FacultyApprovalController {
  constructor(private facultyApprovalService: FacultyApprovalService) {}

  @Get()
  @ApiFilterQuery("q", FacultyApprovalGetQueryDto)
  @ApiResponse({ type: GetFacultyApprovalsReturnDto, isArray: true })
  async getFacultyApprovals(@Query("q") query: FacultyApprovalGetQueryDto) {
    const ans = await this.facultyApprovalService.getFacultyApprovals(query);

    console.log(ans);

    return pipeTransformArray(ans, GetFacultyApprovalsReturnDto);
  }

  /*
   *   @Post()
   *   @ApiOperation({
   *     description: "Create faculty approvals in bulk",
   *   })
   *   @ApiBody({ type: [CreateFacultyApprovalDto] })
   *   @ApiResponse({ type: String, isArray: true })
   *   async createFacultyApprovals(
   *     @Body(new ParseArrayPipe({ items: CreateFacultyApprovalDto })) body: CreateFacultyApprovalDto[]
   *   ) {
   *     return await this.facultyApprovalService.createFacultyApprovals(body);
   *   }
   */

  @Patch()
  @UseInterceptors(TransactionInterceptor)
  @ApiBody({ type: UpdateFacultyApprovalDto, isArray: true })
  async updateFacultyApproval(
    @Body(new ParseArrayPipe({ items: UpdateFacultyApprovalDto })) body: UpdateFacultyApprovalDto[],
    @TransactionParam() t: Transaction
  ) {
    const pr = body.map((data) => this.facultyApprovalService.updateFacultyApproval(data, t));
    const ans = await Promise.all(pr);

    return ans;
  }

  @Delete()
  @ApiQuery({ name: "id", type: String, isArray: true })
  @UseInterceptors(TransactionInterceptor)
  async deleteFacultyApprovals(@Query("id") ids: string | string[], @TransactionParam() t: Transaction) {
    const pids = typeof ids === "string" ? [ids] : ids;

    return await this.facultyApprovalService.deleteFacultyApprovals(pids, t);
  }
}

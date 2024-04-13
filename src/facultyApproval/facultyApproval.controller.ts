import { Body, Controller, Delete, Get, Param, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FacultyApprovalService } from "./facultyApproval.service";
import { FacultyApprovalQueryDto } from "./dtos/query.dto";
import { ApiFilterQuery, createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { GetFacultyApprovalsDto } from "./dtos/get.dto";
import { CreateFacultyApprovalsDto } from "./dtos/post.dto";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";

@Controller("facultyApprovalRequests")
@ApiTags("FacultyApprovalRequest")
export class FacultyApprovalController {
  constructor(private facultyApprovalService: FacultyApprovalService) {}

  @Get()
  @ApiFilterQuery("q", FacultyApprovalQueryDto)
  @ApiOperation({ description: "Refer to FacultyApprovalQueryDto for the schema." })
  @ApiResponse({ type: GetFacultyApprovalsDto, isArray: true })
  async getFacultyApprovals(@Query("q") where: FacultyApprovalQueryDto) {
    const ans = await this.facultyApprovalService.getFacultyApprovalRequests(where);

    return pipeTransformArray(ans, GetFacultyApprovalsDto);
  }

  @Post("/:salaryId")
  @ApiBody({ type: CreateFacultyApprovalsDto, isArray: true })
  @UseInterceptors(TransactionInterceptor)
  async createFacultyApprovals(
    @Param("salaryId") salaryId: string,
    @Body(createArrayPipe(CreateFacultyApprovalsDto)) facReqs: CreateFacultyApprovalsDto[],
    @TransactionParam() t: Transaction
  ) {
    const ans = await this.facultyApprovalService.createFacultyApprovalRequests(salaryId, facReqs, t);

    return ans;
  }

  @Delete("/:id")
  @UseInterceptors(TransactionInterceptor)
  async deleteFacultyApproval(@Param("id") id: string, @TransactionParam() t: Transaction) {
    const ans = await this.facultyApprovalService.deleteFacultyApprovalRequest(id, t);

    return ans;
  }
}

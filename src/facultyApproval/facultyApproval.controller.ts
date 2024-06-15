import { Body, Controller, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FacultyApprovalService } from "./facultyApproval.service";
import { DeleteValues, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { FacultyApprovalsQueryDto } from "./dtos/query.dto";
import { GetFacultyApprovalsDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { CreateFacultyApprovalsDto } from "./dtos/post.dto";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { UpdateFacultyApprovalsDto } from "./dtos/patch.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("faculty-approvals")
@ApiTags("FacultyApproval")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class FacultyApprovalController {
  constructor(private facultyApprovalService: FacultyApprovalService) {}

  @GetValues(FacultyApprovalsQueryDto, GetFacultyApprovalsDto)
  async getFacultyApprovals(@Query("q") where: FacultyApprovalsQueryDto) {
    const ans = await this.facultyApprovalService.getFacultyApprovals(where);

    return pipeTransformArray(ans, GetFacultyApprovalsDto);
  }

  @Post("/:salaryId")
  @ApiBody({ type: CreateFacultyApprovalsDto, isArray: true })
  @ApiParam({ name: "salaryId", type: String })
  @ApiResponse({ type: String, isArray: true })
  @UseInterceptors(TransactionInterceptor)
  async createFacultyApprovals(
    @Param("salaryId", new ParseUUIDPipe()) salaryId: string,
    @Body(createArrayPipe(CreateFacultyApprovalsDto)) facultyApprovals: CreateFacultyApprovalsDto[],
    @TransactionParam() t: Transaction
  ) {
    const ans = await this.facultyApprovalService.createFacultyApprovals(salaryId, facultyApprovals, t);

    return ans;
  }

  @PatchValues(UpdateFacultyApprovalsDto)
  @UseInterceptors(TransactionInterceptor)
  async updateFacultyApprovals(
    @Body(createArrayPipe(UpdateFacultyApprovalsDto)) facultyApprovals: UpdateFacultyApprovalsDto[],
    @TransactionParam() t: Transaction
  ) {
    const pr = facultyApprovals.map((facultyApproval) =>
      this.facultyApprovalService.updateFacultyApproval(facultyApproval, t)
    );
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @DeleteValues()
  async deleteFacultyApprovals(@Query() query: DeleteValuesDto, @TransactionParam() t: Transaction) {
    const ids = typeof query.id === "string" ? [query.id] : query.id;
    const pr = ids.map((id) => this.facultyApprovalService.deleteFacultyApproval(id, t));
    const ans = await Promise.all(pr);

    return ans.reduce((acc, val) => acc + val, 0);
  }
}

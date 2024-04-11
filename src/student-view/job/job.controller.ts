import { Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common";
import { JobService } from "./job.service";
import { IUser } from "src/auth/User";
import { User } from "src/decorators/User";
import { AuthGuard } from "@nestjs/passport";
import { FileService } from "src/services/FileService";
import { env } from "src/config";
import path from "path";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetSalaryDto } from "./dtos/getSalary.dto";
import { pipeTransform, pipeTransformArray } from "src/utils/utils";
import { GetSalariesReturnDto } from "./dtos/getSalaries.dto";

@Controller("/student-view/jobs") // Accessible by student.
@ApiTags("Student View")
@UseGuards(AuthGuard("jwt"))
export class JobController {
  constructor(
    private jobService: JobService,
    private fileService: FileService
  ) {}

  @Get()
  @ApiResponse({ type: GetSalariesReturnDto, isArray: true })
  async getJobs(@User() user: IUser, @Query("application") application: string) {
    const applications = Number(application) || 0;
    const ans = await this.jobService.getSalaries(user.studentId, applications);

    return pipeTransformArray(ans, GetSalariesReturnDto);
  }

  @Get("/:id")
  @ApiResponse({ type: GetSalaryDto })
  async getJob(@User() user: IUser, @Param("id", new ParseUUIDPipe()) salaryId: string) {
    const ans = await this.jobService.getSalary(user.studentId, salaryId);

    if (ans.job.attachment) {
      const folderName = env().UPLOAD_DIR;
      const filePath = path.join(folderName, "jd", ans.job.attachment);
      const file = await this.fileService.getFileasBuffer(filePath);
      const base64 = file.toString("base64");

      ans.job.attachment = base64;
    }

    return pipeTransform(ans, GetSalaryDto);
  }

  @Post("/:id/:resumeId")
  async createApplication(
    @User() user: IUser,
    @Param("id", new ParseUUIDPipe()) salaryId: string,
    @Param("resumeId", new ParseUUIDPipe()) resumeId: string
  ) {
    const ans = await this.jobService.applySalary(user.studentId, salaryId, resumeId);

    return ans;
  }
}

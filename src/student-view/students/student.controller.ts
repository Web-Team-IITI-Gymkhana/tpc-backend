import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StudentService } from "./student.service";
import { CreateFile, DeleteFiles, GetFile, GetValue } from "src/decorators/controller";
import { GetJobDto, GetJobsDto, GetStudentEventsDto, GetStudentResumesDto, StudentViewDto } from "./dtos/get.dto";
import { User } from "src/decorators/User";
import { IUser } from "src/auth/User";
import { pipeTransform, pipeTransformArray } from "src/utils/utils";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { JD_FOLDER, RESUME_FOLDER, POLICY_FOLDER } from "src/constants";
import { FileService } from "src/services/FileService";
import path from "path";
import { DeleteFilesDto } from "src/utils/utils.dto";
import { Response } from "express";
import { CreateStudentResumeDto } from "./dtos/post.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";
import { JobsQueryDto } from "src/job/dtos/query.dto";
import { EventsQueryDto } from "src/event/dtos/query.dto";
import { GetEventsDto } from "src/event/dtos/get.dto";
import { OnboardingUpdateDto } from "../../student/dtos/patch.dto";

@Controller("student-view")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.STUDENT))
@ApiTags("Student-View/Student")
@ApiBearerAuth("jwt")
export class StudentController {
  folderName = RESUME_FOLDER;
  JDFolder = JD_FOLDER;
  policyFolder = POLICY_FOLDER;

  constructor(
    private studentService: StudentService,
    private fileService: FileService
  ) {}

  @Get()
  @ApiResponse({ type: StudentViewDto })
  async getStudent(@User() user: IUser) {
    const ans = await this.studentService.getStudent(user.studentId);

    return pipeTransform(ans, StudentViewDto);
  }

  @Get("opportunities")
  @ApiResponse({ type: GetJobsDto, isArray: true })
  async getOpportunities(@Query("q") where: JobsQueryDto, @User() user: IUser) {
    const ans = await this.studentService.getOpportunities(user.studentId, where);

    return pipeTransformArray(ans, GetJobsDto);
  }

  @Get("jobs")
  @ApiResponse({ type: GetJobsDto, isArray: true })
  async getJobs(@Query("q") where: JobsQueryDto, @User() user: IUser) {
    const ans = await this.studentService.getJobs(user.studentId, where);

    return pipeTransformArray(ans, GetJobsDto);
  }

  @Get("job/:id")
  @ApiResponse({ type: GetJobDto })
  async getJob(@Param("id", new ParseUUIDPipe()) id: string, @User() user: IUser) {
    const ans = await this.studentService.getJob(user.studentId, id);

    return pipeTransform(ans, GetJobDto);
  }

  @Get("events")
  @ApiResponse({ type: GetEventsDto, isArray: true })
  async getEvents(@Query("q") where: EventsQueryDto, @User() user: IUser) {
    const ans = await this.studentService.getEvents(where, user.studentId);

    return pipeTransformArray(ans, GetEventsDto);
  }

  @Get("events/:jobId")
  @ApiResponse({ type: GetStudentEventsDto, isArray: true })
  async getStudentEvents(@Param("jobId", new ParseUUIDPipe()) id: string, @User() user: IUser) {
    const ans = await this.studentService.getStudentEvents(id, user.studentId);

    return pipeTransformArray(ans, GetStudentEventsDto);
  }

  @Get("resume")
  @ApiResponse({ type: GetStudentResumesDto, isArray: true })
  async getStudentResumes(@User() user: IUser) {
    const ans = await this.studentService.getResumes({ studentId: user.studentId });

    return pipeTransformArray(ans, GetStudentResumesDto);
  }

  @CreateFile(CreateStudentResumeDto, "resume")
  @UseInterceptors(TransactionInterceptor)
  async createResume(
    @UploadedFile() file,
    @User() user: IUser,
    @Body("name") name: string,
    @TransactionParam() t: Transaction
  ) {
    const filepath = uuidv4() + ".pdf";
    const ans = await this.studentService.addResume(user.studentId, filepath, name, t);
    await this.fileService.uploadFile(path.join(this.folderName, filepath), file);

    return ans;
  }

  @DeleteFiles()
  @UseInterceptors(TransactionInterceptor)
  async deleteResumes(@Query() query: DeleteFilesDto, @User() user: IUser, @TransactionParam() t: Transaction) {
    const ans = await this.studentService.deleteResumes(user.studentId, query.filename, t);
    const filenames = typeof query.filename === "string" ? [query.filename] : query.filename;
    const pr = filenames.map((filename) => this.fileService.deleteFile(path.join(this.folderName, filename)));
    await Promise.all(pr);

    return ans;
  }

  @GetFile(["application/pdf"], "resume")
  async getResume(@Param("filename") filename: string, @User() user: IUser, @Res({ passthrough: true }) res: Response) {
    const ans = await this.studentService.getResumes({ studentId: user.studentId, filepath: filename });
    if (ans.length === 0) throw new NotFoundException(`Resume with filename ${filename} not found`);
    const file = this.fileService.getFile(path.join(this.folderName, filename));
    res.setHeader("Content-Type", "application/pdf");

    return new StreamableFile(file);
  }

  @GetFile(["application/pdf"], "jd")
  async getJd(@Param("filename") filename: string, @User() user: IUser, @Res({ passthrough: true }) res: Response) {
    const ans = await this.studentService.getJD(filename, user.studentId);
    if (!ans) throw new NotFoundException(`File ${filename} not found`);
    const file = this.fileService.getFile(path.join(this.JDFolder, filename));
    res.setHeader("Content-Type", "application/pdf");

    return new StreamableFile(file);
  }

  @Patch("/onboarding")
  @ApiResponse({ type: String })
  async updateOnboarding(@Body() updateData: OnboardingUpdateDto, @User() user: IUser) {
    return await this.studentService.updateOnboarding(user.studentId, updateData);
  }

  @Patch("/registrations/:seasonId")
  @ApiParam({ name: "seasonId", type: "string" })
  @ApiResponse({ type: String, isArray: true })
  async registerSeason(@Param("seasonId", new ParseUUIDPipe()) seasonId: string, @User() user: IUser) {
    return await this.studentService.registerSeason(user.studentId, seasonId);
  }

  @Patch("/de-register/:seasonId")
  @ApiParam({ name: "seasonId", type: "string" })
  @ApiResponse({ type: String, isArray: true })
  async deregisterSeason(@Param("seasonId", new ParseUUIDPipe()) seasonId: string, @User() user: IUser) {
    return await this.studentService.deregisterSeason(user.studentId, seasonId);
  }

  @GetFile(["application/pdf"], "policy")
  async getPolicyDocument(
    @Param("filename") filename: string,
    @User() user: IUser,
    @Res({ passthrough: true }) res: Response
  ) {
    /*
     * Verify that the student has access to this policy document
     * by checking if they have any registration for a season with this policy document
     */
    const studentData = await this.studentService.getStudent(user.studentId);
    const hasAccess = studentData.registrations.some((registration) => registration.season.policyDocument === filename);

    if (!hasAccess) {
      throw new NotFoundException(`Policy document ${filename} not found or access denied`);
    }

    const file = this.fileService.getFile(path.join(this.policyFolder, filename));
    res.setHeader("Content-Type", "application/pdf");

    return new StreamableFile(file);
  }
}

import {
  Controller,
  Get,
  Delete,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Post,
  BadRequestException,
  Param,
  StreamableFile,
  NotFoundException,
  Res,
  Patch,
} from "@nestjs/common";
import { FileService } from "src/services/FileService";
import { StudentService } from "./student.service";
import { pipeTransform, pipeTransformArray } from "src/utils/utils";
import { ResumeReturnDto, StudentReturnDto } from "./dtos/get.dto";
import { User } from "src/decorators/User";
import { IUser } from "src/auth/User";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { RESUME_SIZE_LIMIT } from "src/constants";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { env } from "src/config";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { File } from "buffer";
import { Response } from "express";
import { ApiBody, ApiConsumes, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("student-view") // Accessible by student.
@ApiTags("Student View")
@UseGuards(AuthGuard("jwt"))
export class StudentController {
  constructor(
    private studentService: StudentService,
    private fileService: FileService
  ) {}

  @Get()
  @ApiResponse({ type: StudentReturnDto })
  async getStudent(@User() user: IUser) {
    const ans = await this.studentService.getStudent(user.studentId);

    return pipeTransform(ans, StudentReturnDto);
  }

  getFilePath(filename?: string) {
    const newFilename = uuidv4() + ".pdf";
    const filepath = path.join(env().UPLOAD_DIR, "resume", filename || newFilename);

    return [filename || newFilename, filepath];
  }

  @Post("/resumes")
  @UseInterceptors(FileInterceptor("resume"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: { type: "object", properties: { resume: { type: "string", format: "binary" } } } })
  @UseInterceptors(TransactionInterceptor)
  async addResume(@UploadedFile() file, @User() user: IUser, @TransactionParam() t: Transaction) {
    const [filename, filepath] = this.getFilePath();

    //File Constraints: Must be PDF checked using magic bytes and the size must be less than the RESUME_SIZE_LIMIT.
    const magic = file.buffer.slice(0, 4).toString("ascii");
    if (magic !== "%PDF") throw new BadRequestException("Only PDF is supported");
    if (file.size > RESUME_SIZE_LIMIT) throw new BadRequestException("The size is above the permissible Limits");

    const res = await this.studentService.addResume(filename, user.studentId, t);
    const ans = await this.fileService.uploadFile(filepath, file);

    return res;
  }

  @Delete("/resumes")
  @ApiQuery({ name: "filename", type: "string", isArray: true })
  @UseInterceptors(TransactionInterceptor)
  async deleteResumes(
    @Query("filename") filenames: string | string[],
    @User() user: IUser,
    @TransactionParam() t: Transaction
  ) {
    const pfps = typeof filenames === "string" ? [filenames] : filenames;
    const res = await this.studentService.deleteResumes(pfps, user.studentId, t);
    const pr = pfps.map((fp) => this.fileService.deleteFile(this.getFilePath(fp)[1]));
    await Promise.all(pr);

    return res;
  }

  @Get("/resumes")
  @ApiResponse({ type: ResumeReturnDto, isArray: true })
  async getResumes(@User() user: IUser) {
    const ans = await this.studentService.getResumes({ studentId: user.studentId });

    return pipeTransformArray(ans, ResumeReturnDto);
  }

  @Get("/resumes/:filename")
  @ApiResponse({ type: StreamableFile })
  async getResume(@Param("filename") filename: string, @User() user: IUser, @Res({ passthrough: true }) res: Response) {
    const [resume] = await this.studentService.getResumes({
      filepath: filename,
      studentId: user.studentId,
    });
    const [_, filepath] = this.getFilePath(filename);
    if (!resume) throw new NotFoundException(`The File with path ${filepath} doesnt Exist.`);
    const fileStream = this.fileService.getFile(filepath);
    res.setHeader("Content-Type", "application/pdf");

    return new StreamableFile(fileStream);
  }

  @Patch("/register/:seasonId")
  async register(@Param("seasonId") seasonId: string, @User() user: IUser) {
    const ans = await this.studentService.register(user.studentId, seasonId);

    return ans;
  }
}

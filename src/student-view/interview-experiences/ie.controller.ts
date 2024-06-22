import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { InterviewExperienceService } from "./ie.service";
import { FileService } from "src/services/FileService";
import { CreateFile, GetFile, GetValues } from "src/decorators/controller";
import { pipeTransformArray } from "src/utils/utils";
import { GetInterviewExperiencesDto } from "./dtos/get.dto";
import { InterviewExperienceQueryDto } from "./dtos/query.dto";
import { IE_FOLDER, IE_SIZE_LIMIT } from "src/constants";
import path from "path";
import { CreateIEDto } from "./dtos/post.dto";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { v4 as uuidv4 } from "uuid";
import { User } from "src/decorators/User";
import { IUser } from "src/auth/User";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";

@Controller("student-view/interview-experiences")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.STUDENT))
@ApiTags("Student-View/Interview Experience") // Allow all admin, student to access and edits for students.
@ApiBearerAuth("jwt")
export class InterviewExperienceController {
  folder = IE_FOLDER;

  constructor(
    private ieService: InterviewExperienceService,
    private fileService: FileService
  ) {}

  @GetValues(InterviewExperienceQueryDto, GetInterviewExperiencesDto)
  async getInterviewExperiences(@Query("q") where: InterviewExperienceQueryDto) {
    const ans = await this.ieService.getInterviewExperiences(where);

    return pipeTransformArray(ans, GetInterviewExperiencesDto);
  }

  @GetFile(["application/pdf"], "")
  async getInterviewExperienceFile(@Param("filename") filename: string, @Res({ passthrough: true }) res: Response) {
    const filepath = path.join(this.folder, filename);
    const file = this.fileService.getFile(filepath);
    res.setHeader("Content-Type", "application/pdf");

    return new StreamableFile(file);
  }

  @CreateFile(CreateIEDto, "ie")
  @UseInterceptors(TransactionInterceptor)
  async createInterviewExperience(
    @Body() ie: CreateIEDto,
    @UploadedFile() file,
    @TransactionParam() t: Transaction,
    @User() user: IUser
  ) {
    //Check the file
    const magic = file.buffer.slice(0, 4).toString("ascii");
    if (magic !== "%PDF") throw new BadRequestException("Only PDF is supported");
    if (file.size > IE_SIZE_LIMIT) throw new BadRequestException("The size is above the permissible Limits");

    const filename = uuidv4() + ".pdf";
    const filepath = path.join(this.folder, filename);

    ie.filename = filename;
    ie.studentId = user.studentId;

    const ans = await this.ieService.createInterviewExperience(ie, user.id, t);
    await this.fileService.uploadFile(filepath, file);

    return ans;
  }

  @Delete()
  @ApiQuery({ name: "filename", type: String })
  @ApiResponse({ type: Number })
  @UseInterceptors(TransactionInterceptor)
  async deleteInterviewExperience(
    @Query("filename") filename: string,
    @User() user: IUser,
    @TransactionParam() t: Transaction
  ) {
    const ans = await this.ieService.deleteInterviewExperience(filename, user.studentId, t);
    await this.fileService.deleteFile(path.join(this.folder, filename));

    return ans;
  }
}

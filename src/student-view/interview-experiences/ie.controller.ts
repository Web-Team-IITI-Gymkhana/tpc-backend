import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  StreamableFile,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  ParseUUIDPipe,
} from "@nestjs/common";
import { InterviewExperienceService } from "./ie.service";
import { env } from "src/config";
import path from "path";
import { FileService } from "src/services/FileService";
import { Response } from "express";
import { User } from "src/decorators/User";
import { IUser } from "src/auth/User";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { v4 as uuidv4 } from "uuid";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { IE_SIZE_LIMIT } from "src/constants";
import { WhereIEDto, IEReturnDto } from "./dtos/get.dto";
import { ApiFilterQuery, pipeTransformArray } from "src/utils/utils";
import { CreateIEDto } from "./dtos/post.dto";
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("/student-view/interview-experiences") //Accessible by student, admin, tpcmember.
@ApiTags("Student View")
@UseGuards(AuthGuard("jwt"))
export class InterviewExperienceController {
  private foldername = path.join(env().UPLOAD_DIR, "InterviewExperience");

  constructor(
    private iexService: InterviewExperienceService,
    private fileService: FileService
  ) {}

  @Get()
  @ApiFilterQuery("q", WhereIEDto)
  @ApiOperation({ summary: "Get Interview Experiences", description: "Get Interview Experiences Refer to WhereIEDto" })
  @ApiResponse({ type: IEReturnDto, isArray: true })
  async getInterviewExperiences(@Query("q") where: WhereIEDto) {
    const ans = await this.iexService.getInterviewExperiences(where);

    return pipeTransformArray(ans, IEReturnDto);
  }

  @Get("/:id")
  @ApiQuery({ name: "id", type: String })
  @ApiResponse({ type: StreamableFile })
  async getInterviewExperience(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const filename = await this.iexService.getInterviewExperience(id);
    const filepath = path.join(this.foldername, filename);

    const ans = this.fileService.getFile(filepath);
    res.setHeader("Content-Type", "application/pdf");

    return new StreamableFile(ans);
  }

  @Post()
  @UseInterceptors(FileInterceptor("ie"))
  @UseInterceptors(TransactionInterceptor)
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreateIEDto })
  async createInterviewExperience(
    @UploadedFile() file,
    @User() user: IUser,
    @Body() body: CreateIEDto,
    @TransactionParam() t: Transaction
  ) {
    const filename = uuidv4() + path.extname(file.originalname);
    const filepath = path.join(this.foldername, filename);

    //File Constraints: Must be PDF checked using magic bytes and the size must be less than the RESUME_SIZE_LIMIT.
    const magic = file.buffer.slice(0, 4).toString("ascii");
    if (magic !== "%PDF") throw new BadRequestException("Only PDF is supported");
    if (file.size > IE_SIZE_LIMIT) throw new BadRequestException("The size is above the permissible Limits");

    const ans = await this.iexService.createInterviewExperience(
      { ...body, filename: filename },
      user.studentId,
      user.id,
      t
    );
    await this.fileService.uploadFile(filepath, file);

    return ans;
  }

  @Delete("/:filename")
  @ApiQuery({ name: "filename", type: String, isArray: true })
  @UseInterceptors(TransactionInterceptor)
  async deleteInterviewExperience(
    @Param("filename") filename: string,
    @User() user: IUser,
    @TransactionParam() t: Transaction
  ) {
    const ans = await this.iexService.deleteInterviewExperience(filename, user.studentId, t);
    const filepath = path.join(this.foldername, filename);
    await this.fileService.deleteFile(filepath);

    return ans;
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Get,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiResponse } from "@nestjs/swagger";
import { ResumeService } from "./resume.service";
import { ResumeQueryDto } from "./dtos/query.dto";
import { createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { GetResumeDto, GetResumesDto } from "./dtos/get.dto";
import { CreateFile, DeleteFiles, GetValue, GetValues, PatchValues } from "src/decorators/controller";
import { CreateResumeDto } from "./dtos/post.dto";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { FileService } from "src/services/FileService";
import { RESUME_FOLDER, RESUME_SIZE_LIMIT } from "src/constants";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { omit } from "lodash";
import { UpdateResumesDto } from "./dtos/patch.dto";
import { DeleteFilesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";
import { SignedUrlService } from "src/services/SignedUrlService";

@Controller("resumes")
@ApiTags("Resume")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
export class ResumeController {
  foldername = RESUME_FOLDER;
  constructor(
    private resumeService: ResumeService,
    private fileService: FileService,
    private signedUrlService: SignedUrlService
  ) {}

  @GetValues(ResumeQueryDto, GetResumesDto)
  async getResumes(@Query() where: ResumeQueryDto) {
    const ans = await this.resumeService.getResumes(where);

    return pipeTransformArray(ans, GetResumesDto);
  }

  @GetValue(GetResumeDto)
  async getResume(@Param("id", new ParseUUIDPipe()) id: string) {
    const ans = await this.resumeService.getResume(id);

    return pipeTransform(ans, GetResumeDto);
  }

  @Get("/file/:filename/signed-url")
  @ApiResponse({ type: String })
  async getResumeFileSignedUrl(@Param("filename") filename: string) {
    // You might want to add additional authorization checks here
    const signedUrl = this.signedUrlService.generateSignedResumeUrl(filename);

    return { url: signedUrl };
  }

  @CreateFile(CreateResumeDto, "resume")
  @UseInterceptors(TransactionInterceptor)
  async createResume(@Body() resume: CreateResumeDto, @UploadedFile() file, @TransactionParam() t: Transaction) {
    //Check the file
    const magic = file.buffer.slice(0, 4).toString("ascii");
    if (magic !== "%PDF") throw new BadRequestException("Only PDF is supported");
    if (file.size > RESUME_SIZE_LIMIT) throw new BadRequestException("The size is above the permissible Limits");

    const filename = uuidv4() + ".pdf";

    const ans = await this.resumeService.createResume({ ...omit(resume, "resume"), filepath: filename }, t);
    await this.fileService.uploadFile(path.join(this.foldername, filename), file);

    return ans;
  }

  @PatchValues(UpdateResumesDto)
  async updateResumes(@Body(createArrayPipe(UpdateResumesDto)) resumes: UpdateResumesDto[]) {
    const pr = resumes.map((resume) => this.resumeService.updateResume(resume));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @DeleteFiles()
  @UseInterceptors(TransactionInterceptor)
  async deleteResumes(@Query() query: DeleteFilesDto, @TransactionParam() t: Transaction) {
    const ans = await this.resumeService.deleteResumes(query.filename, t);
    const filenames = typeof query.filename === "string" ? [query.filename] : query.filename;
    const pr = filenames.map((filename: string) => this.fileService.deleteFile(path.join(this.foldername, filename)));
    await Promise.all(pr);

    return ans;
  }
}

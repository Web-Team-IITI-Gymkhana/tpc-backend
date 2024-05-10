import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResumeService } from "./resume.service";
import { ResumeQueryDto } from "./dtos/query.dto";
import { createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { GetResumeDto, GetResumesDto } from "./dtos/get.dto";
import { CreateFile, DeleteFiles, GetFile, GetValue, GetValues, PatchValues } from "src/decorators/controller";
import { CreateResumeDto } from "./dtos/post.dto";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { FileService } from "src/services/FileService";
import { RESUME_FOLDER, RESUME_SIZE_LIMIT } from "src/constants";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { omit } from "lodash";
import { Response } from "express";
import { UpdateResumesDto } from "./dtos/patch.dto";
import { DeleteFilesDto } from "src/utils/utils.dto";

@Controller("resumes")
@ApiTags("Resume")
export class ResumeController {
  foldername = RESUME_FOLDER;
  constructor(
    private resumeService: ResumeService,
    private fileService: FileService
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

  @GetFile(["application/pdf"], "file")
  async getResumeFile(@Param("filename") filename: string, @Res({ passthrough: true }) res: Response) {
    const filestream = this.fileService.getFile(path.join(this.foldername, filename));
    res.setHeader("Content-Type", "application/pdf");

    return new StreamableFile(filestream);
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

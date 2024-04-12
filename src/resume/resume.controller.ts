import { Controller, Get, Patch, Body, Query, Param, StreamableFile } from "@nestjs/common";
import path from "path";
import { env } from "src/config";
import { ResumeService } from "./resume.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResumeGetQueryDto } from "./dtos/query.dto";
import { ApiFilterQuery, createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { GetResumesReturnDto } from "./dtos/get.dto";
import { FileService } from "src/services/FileService";
import { PatchResumeDto } from "./dtos/patch.dto";

@Controller("resumes")
@ApiTags("Resume")
export class ResumeController {
  private folderName = path.join(env().UPLOAD_DIR, "resume");

  constructor(
    private resumeService: ResumeService,
    private fileService: FileService
  ) {}

  @Get()
  @ApiFilterQuery("q", ResumeGetQueryDto)
  @ApiOperation({ description: "Refer to ResumeGetQueryDto for schema" })
  @ApiResponse({ type: GetResumesReturnDto, isArray: true })
  async getResumes(@Query("q") where: ResumeGetQueryDto) {
    const ans = await this.resumeService.getResumes(where);

    return pipeTransformArray(ans, GetResumesReturnDto);
  }

  @Get("/:filename")
  async getResume(@Param("filename") filename: string) {
    const filepath = path.join(this.folderName, filename);
    const ans = this.fileService.getFile(filepath);

    return new StreamableFile(ans);
  }

  @Patch()
  @ApiBody({ type: PatchResumeDto, isArray: true })
  async updateResumes(@Body(createArrayPipe(PatchResumeDto)) resumes: PatchResumeDto[]) {
    const pr = resumes.map((resume) => this.resumeService.updateResume(resume));
    const ans = await Promise.all(pr);

    return ans.flat();
  }
}

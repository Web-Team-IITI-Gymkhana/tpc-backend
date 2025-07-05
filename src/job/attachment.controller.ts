import { Body, Controller, Param, Query, UploadedFile, UseGuards, UseInterceptors, Get } from "@nestjs/common";
import { JobService } from "./job.service";
import { FileService } from "src/services/FileService";
import { CreateFile, DeleteFiles } from "src/decorators/controller";
import { JD_FOLDER } from "src/constants";
import { CreateAttachmentDto } from "./dtos/post.dto";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { DeleteFilesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";
import { SignedUrlService } from "src/services/SignedUrlService";
import { ApiResponse } from "@nestjs/swagger";
import path from "path";

@Controller("/jobs/attachment")
@UseGuards(AuthGuard("jwt"))
export class AttachmentController {
  folderName = JD_FOLDER;

  constructor(
    private fileService: FileService,
    private jobService: JobService,
    private signedUrlService: SignedUrlService
  ) {}

  @Get("/:filename/signed-url")
  @ApiResponse({ type: String })
  async getJDSignedUrl(@Param("filename") filename: string) {
    const signedUrl = this.signedUrlService.generateSignedJdUrl(filename);

    return { url: signedUrl };
  }

  @CreateFile(CreateAttachmentDto, "jd")
  @UseInterceptors(TransactionInterceptor)
  async createJd(@Body() body: CreateAttachmentDto, @UploadedFile() file, @TransactionParam() t: Transaction) {
    const filename = uuidv4() + ".pdf";
    const ans = await this.jobService.addAttachment({ ...body, filename }, t);
    await this.fileService.uploadFile(path.join(this.folderName, filename), file);

    return filename;
  }

  @DeleteFiles()
  @UseInterceptors(TransactionInterceptor)
  async deleteJds(@Query() query: DeleteFilesDto, @TransactionParam() t: Transaction) {
    const ans = await this.jobService.deleteAttachments(query.filename, t);
    const filenames = typeof query.filename === "string" ? [query.filename] : query.filename;
    await Promise.all(filenames.map((filename) => this.fileService.deleteFile(path.join(this.folderName, filename))));

    return ans.reduce((acc, cur) => acc + cur, 0);
  }
}

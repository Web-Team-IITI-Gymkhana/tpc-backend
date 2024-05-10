import { Body, Controller, Param, Query, Res, StreamableFile, UploadedFile, UseInterceptors } from "@nestjs/common";
import { JobService } from "./job.service";
import { FileService } from "src/services/FileService";
import { CreateFile, DeleteFiles, GetFile } from "src/decorators/controller";
import { ApiParam } from "@nestjs/swagger";
import { JD_FOLDER } from "src/constants";
import path from "path";
import { Response } from "express";
import { CreateAttachmentDto } from "./dtos/post.dto";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { DeleteFilesDto } from "src/utils/utils.dto";

@Controller("/jobs/attachment")
export class AttachmentController {
  folderName = JD_FOLDER;

  constructor(
    private fileService: FileService,
    private jobService: JobService
  ) {}

  @GetFile(["application/pdf"])
  async getJD(@Param("filename") filename: string, @Res({ passthrough: true }) res: Response) {
    const ans = this.fileService.getFile(path.join(this.folderName, filename));
    res.setHeader("Content-Type", "application/pdf");

    return new StreamableFile(ans);
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

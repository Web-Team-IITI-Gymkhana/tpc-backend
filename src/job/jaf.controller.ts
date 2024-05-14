import { BadRequestException, Body, Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { JafService } from "./jaf.service";
import { ApiTags, ApiResponse, ApiBody } from "@nestjs/swagger";
import { GetJafValuesDto, JafDto } from "./dtos/jaf.dto";
import { pipeTransform, pipeTransformArray } from "src/utils/utils";
import { FileService } from "src/services/FileService";
import { CreateFile } from "src/decorators/controller";
import { v4 as uuidv4 } from "uuid";
import { JD_FOLDER, JD_SIZE_LIMIT } from "src/constants";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import path from "path";

@Controller("jaf")
@ApiTags("JAF")
export class JafController {
  foldername = JD_FOLDER;

  constructor(
    private jafService: JafService,
    private fileService: FileService
  ) {}

  @Get()
  @ApiResponse({ type: GetJafValuesDto })
  async getJafDetails() {
    const ans = await this.jafService.getJafDetails();
    // console.log(ans);

    return pipeTransform(ans, GetJafValuesDto);
  }

  @Post()
  @ApiResponse({ type: String })
  @UseInterceptors(TransactionInterceptor)
  async createJaf(@Body() jaf: JafDto, @TransactionParam() t: Transaction) {
    const file = jaf.job.attachment ? { buffer: Buffer.from(jaf.job.attachment, "base64"), size: 0 } : undefined;
    if (file) {
      file.size = file.buffer.length;
      const magic = file.buffer.subarray(0, 4).toString("ascii");
      if (magic !== "%PDF") throw new BadRequestException("Only PDF is supported");
      if (file.size > JD_SIZE_LIMIT) throw new BadRequestException("File size too large");
      const filename = uuidv4() + ".pdf";
      jaf.job.attachment = filename;

      const ans = await this.jafService.createJaf(jaf.job, jaf.salaries, t);
      await this.fileService.uploadFile(path.join(this.foldername, filename), file);

      return ans;
    }

    const ans = await this.jafService.createJaf(jaf.job, jaf.salaries, t);

    return ans;
  }
}

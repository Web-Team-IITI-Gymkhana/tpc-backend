import { Controller, Get, Post, Patch, Param, UseInterceptors, Body, UploadedFiles } from "@nestjs/common";
import { JafService } from "./jaf.service";
import { CreateJafDto } from "./dtos/jaf.dto";
import { omit } from "lodash";
import { JobStatusTypeEnum } from "src/enums";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";

@Controller("jaf")
@ApiTags("Job")
export class JafController {
  constructor(private jafService: JafService) {}

  @Get()
  async getJafDetails() {
    const ans = await this.jafService.getJafDetails();

    return ans;
  }

  @Post()
  @UseInterceptors(FileInterceptor("files"))
  @UseInterceptors(TransactionInterceptor)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createJaf(@Body() jaf: CreateJafDto, @UploadedFiles() files: any, @TransactionParam() t: Transaction) {
    const salaries = jaf.salaries;
    const job = jaf.job;

    const ans = await this.jafService.createJaf(job, salaries, t);

    return ans;
  }
}

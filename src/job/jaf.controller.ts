import { BadRequestException, Body, Controller, Get, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { JafService } from "./jaf.service";
import { ApiTags, ApiResponse, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { GetJafValuesDto, JafDto } from "./dtos/jaf.dto";
import { pipeTransform, pipeTransformArray } from "src/utils/utils";
import { FileService } from "src/services/FileService";
import { v4 as uuidv4 } from "uuid";
import { JD_FOLDER, JD_SIZE_LIMIT } from "src/constants";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import path from "path";
import { AuthGuard } from "@nestjs/passport";

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
}

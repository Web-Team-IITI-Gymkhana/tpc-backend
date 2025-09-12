import {
  Body,
  Controller,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Param,
  Res,
  StreamableFile,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SeasonService } from "./season.service";
import { CreateFile, DeleteValues, GetFile, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { SeasonsQueryDto } from "./dtos/query.dto";
import { GetSeasonsDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { CreateSeasonsDto } from "./dtos/post.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";
import { UpdateSeasonsDto } from "./dtos/patch.dto";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { FileService } from "src/services/FileService";
import { POLICY_FOLDER, POLICY_SIZE_LIMIT } from "src/constants";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { Response } from "express";

@Controller("seasons")
@ApiTags("Season")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
export class SeasonController {
  constructor(
    private seasonService: SeasonService,
    private fileService: FileService
  ) {}

  @GetValues(SeasonsQueryDto, GetSeasonsDto)
  async getSeasons(@Query("q") where: SeasonsQueryDto) {
    const ans = await this.seasonService.getSeasons(where);

    return pipeTransformArray(ans, GetSeasonsDto);
  }

  @CreateFile(CreateSeasonsDto, "policy")
  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  @UseInterceptors(TransactionInterceptor)
  async createSeasons(@Body() seasonData: CreateSeasonsDto, @UploadedFile() file, @TransactionParam() t: Transaction) {
    // Validate policy document if provided
    if (file) {
      const magic = file.buffer.slice(0, 4).toString("ascii");
      if (magic !== "%PDF") throw new BadRequestException("Only PDF is supported for policy documents");
      if (file.size > POLICY_SIZE_LIMIT) throw new BadRequestException("Policy document size exceeds the limit");

      const filename = uuidv4() + ".pdf";
      seasonData.policyDocument = filename;

      // Upload the file
      await this.fileService.uploadFile(path.join(POLICY_FOLDER, filename), file);
    }

    const ans = await this.seasonService.createSeasons([seasonData], t);

    return ans;
  }

  @PatchValues(UpdateSeasonsDto)
  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  async updateSeasons(@Body(createArrayPipe(UpdateSeasonsDto)) seasons: UpdateSeasonsDto[]) {
    const pr = seasons.map((season) => this.seasonService.updateSeasons(season));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @DeleteValues()
  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  async deleteSeasons(@Query() query: DeleteValuesDto) {
    const ans = await this.seasonService.deleteSeasons(query.id);

    return ans;
  }

  @GetFile(["application/pdf"], "/policy")
  async getPolicyDocument(@Param("filename") filename: string, @Res({ passthrough: true }) res: Response) {
    const ans = this.fileService.getFile(path.join(POLICY_FOLDER, filename));
    res.setHeader("Content-Type", "application/pdf");

    return new StreamableFile(ans);
  }
}

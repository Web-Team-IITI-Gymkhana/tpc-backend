import { Controller, Body, Query, Param, ParseUUIDPipe, UseInterceptors, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RecruiterService } from "./recruiter.service";
import { DeleteValues, GetValue, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { RecruiterQueryDto } from "./dtos/query.dto";
import { GetRecruiterDto, GetRecruitersDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { CreateRecruitersDto } from "./dtos/post.dto";
import { UpdateRecuitersDto } from "./dtos/patch.dto";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";

@Controller("recruiters")
@ApiTags("Recruiter")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
export class RecruiterController {
  constructor(private recruiterService: RecruiterService) {}
  @GetValues(RecruiterQueryDto, GetRecruitersDto)
  async getRecruiters(@Query("q") query: RecruiterQueryDto) {
    const ans = await this.recruiterService.getRecuiters(query);

    return pipeTransformArray(ans, GetRecruitersDto);
  }
  @GetValue(GetRecruiterDto)
  async getRecruiter(@Param("id", new ParseUUIDPipe()) id: string) {
    const ans = await this.recruiterService.getRecruiter(id);

    return pipeTransform(ans, GetRecruiterDto);
  }
  @PostValues(CreateRecruitersDto)
  async createRecruiters(@Body(createArrayPipe(CreateRecruitersDto)) recruiters: CreateRecruitersDto[]) {
    const ans = await this.recruiterService.createRecruiters(recruiters);

    return ans;
  }
  @PatchValues(UpdateRecuitersDto)
  @UseInterceptors(TransactionInterceptor)
  async updateRecruiters(
    @Body(createArrayPipe(UpdateRecuitersDto)) recruiters: UpdateRecuitersDto[],
    @TransactionParam() t: Transaction
  ) {
    const pr = recruiters.map((recruiter) => this.recruiterService.updateRecruiter(recruiter, t));
    const ans = await Promise.all(pr);

    return ans.flat();
  }
  @DeleteValues()
  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  async deleteRecruiters(@Query() query: DeleteValuesDto) {
    const ids = query.id;
    const pids = typeof ids === "string" ? [ids] : ids;
    const ans = await this.recruiterService.deleteRecruiters(pids);

    return ans;
  }
}

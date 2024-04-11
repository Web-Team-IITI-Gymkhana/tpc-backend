import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { RecuiterService } from "./recruiter.service";
import { QueryInterceptor } from "src/interceptor/QueryInterceptor";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { RoleEnum } from "src/enums";
import { GetRecruiterQueryDto } from "./dtos/recruiterGetQuery.dto";
import { ApiFilterQuery, createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { GetRecruiterReturnDto, GetRecruitersReturnDto } from "./dtos/recruiterGetReturn.dto";
import { CreateRecruiterDto } from "./dtos/recruiterPost.dto";
import { UpdateRecruiterDto } from "./dtos/recruiterPatch.dto";
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("recruiters")
@ApiTags("Recruiter")
export class RecruiterController {
  constructor(private recruiterService: RecuiterService) {}

  @Get()
  @ApiFilterQuery("q", GetRecruiterQueryDto)
  @ApiOperation({ description: "Please Refer to the GetRecruiterQueryDto for the Schema Ctrl+F it." })
  @ApiResponse({ type: GetRecruitersReturnDto, isArray: true })
  async getRecruiters(@Query("q") where: GetRecruiterQueryDto) {
    const ans = await this.recruiterService.getRecruiters(where);

    return pipeTransformArray(ans, GetRecruitersReturnDto);
  }

  @Get("/:id")
  @ApiResponse({ type: GetRecruiterReturnDto })
  async getRecruiter(@Param("id", new ParseUUIDPipe()) id: string) {
    const ans = await this.recruiterService.getRecruiter(id);

    return pipeTransform(ans, GetRecruiterReturnDto);
  }

  @Post()
  @ApiResponse({ type: String, isArray: true, description: "Array of ids" })
  @ApiBody({ type: CreateRecruiterDto, isArray: true })
  async createRecruiters(@Body(createArrayPipe(CreateRecruiterDto)) body: CreateRecruiterDto[]): Promise<string[]> {
    const recruiters = body.map((data) => {
      data.user.role = RoleEnum.RECRUITER;

      return data;
    });
    const ans = await this.recruiterService.createRecruiters(recruiters);

    return ans;
  }

  @Patch()
  @ApiBody({ type: UpdateRecruiterDto, isArray: true })
  @UseInterceptors(TransactionInterceptor)
  async updateRecruiters(
    @Body(createArrayPipe(UpdateRecruiterDto)) recruiters: UpdateRecruiterDto[],
    @TransactionParam() t: Transaction
  ) {
    const pr = recruiters.map((recruiter) => this.recruiterService.updateRecruiter(recruiter, t));
    const ans = await Promise.all(pr);

    return ans;
  }

  @Delete()
  @ApiQuery({ name: "id", type: String, isArray: true })
  async deleteRecruiters(@Query() ids: string | string[]) {
    const pids = typeof ids === "string" ? [ids] : ids;
    const ans = await this.recruiterService.deleteRecruiters(pids);

    return ans;
  }
}

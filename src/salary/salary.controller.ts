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
} from "@nestjs/common";
import { SalaryService } from "./salary.service";
import { ApiFilterQuery } from "src/utils/utils";
import { GetSalaryQueryDto } from "./dtos/query.dto";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetSalariesReturnDto, GetSalaryReturnDto } from "./dtos/get.dto";
import { CreateSalaryDto } from "./dtos/post.dto";
import { UpdateSalaryDto } from "./dtos/patch.dto";

@Controller("salaries")
@ApiTags("Salary")
export class SalaryController {
  constructor(private salaryService: SalaryService) {}

  @Get()
  @ApiFilterQuery("q", GetSalaryQueryDto)
  @ApiOperation({ description: "Refer to GetSalaryQueryDto for Schema" })
  @ApiResponse({ type: GetSalariesReturnDto, isArray: true })
  async getSalaries(@Query("q") where: GetSalaryQueryDto) {
    return this.salaryService.getSalaries(where);
  }

  @Get("/:id")
  @ApiResponse({ type: GetSalaryReturnDto })
  async getSalary(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.salaryService.getSalary(id);
  }

  @Post()
  @ApiBody({ type: CreateSalaryDto, isArray: true })
  async createSalaries(@Body(new ParseArrayPipe({ items: CreateSalaryDto })) salaries: CreateSalaryDto[]) {
    return this.salaryService.createSalaries(salaries);
  }

  @Patch()
  @ApiBody({ type: UpdateSalaryDto, isArray: true })
  async updateSalaries(@Body(new ParseArrayPipe({ items: UpdateSalaryDto })) salaries: UpdateSalaryDto[]) {
    const pr = salaries.map((salary) => this.salaryService.updateSalary(salary));
    const ans = await Promise.all(pr);

    return ans;
  }

  @Delete()
  async deleteSalaries(@Query() ids: string | string[]) {
    return this.salaryService.deleteSalaries(ids);
  }
}

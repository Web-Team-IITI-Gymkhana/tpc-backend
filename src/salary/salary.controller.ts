import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseUUIDPipe } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetSalaryQueryDto } from "./dtos/query.dto";
import { SalaryService } from "./salary.service";
import { createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { GetSalariesReturnDto, GetSalaryReturnDto } from "./dtos/get.dto";
import { CreateSalaryDto } from "./dtos/post.dto";
import { UpdateSalaryDto } from "./dtos/patch.dto";

@Controller("salaries")
@ApiTags("Admin")
export class SalaryController {
  constructor(private salaryService: SalaryService) {}

  @Get()
  async getSalaries(@Query() where: GetSalaryQueryDto) {
    const ans = await this.salaryService.getSalaries(where);

    return pipeTransformArray(ans, GetSalariesReturnDto);
  }

  @Get("/:id")
  async getSalary(@Param("id", new ParseUUIDPipe()) id: string) {
    const ans = await this.salaryService.getSalary(id);

    return pipeTransform(ans, GetSalaryReturnDto);
  }

  @Post()
  async createSalaries(@Body(createArrayPipe(CreateSalaryDto)) salaries: CreateSalaryDto[]) {
    const ans = await this.salaryService.createSalaries(salaries);

    return ans;
  }

  @Patch()
  async updateSalaries(@Body(createArrayPipe(UpdateSalaryDto)) salaries: UpdateSalaryDto[]): Promise<string[]> {
    const pr = salaries.map((salary) => this.salaryService.updateSalary(salary));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @Delete()
  async deleteSalaries(@Query("id") ids: string | string[]) {
    const ans = await this.salaryService.deleteSalaries(ids);

    return ans;
  }
}

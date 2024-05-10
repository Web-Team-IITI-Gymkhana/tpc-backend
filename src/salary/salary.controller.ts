import { Body, Controller, Param, ParseUUIDPipe, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SalaryService } from "./salary.service";
import { DeleteValues, GetValue, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { SalariesQueryDto } from "./dtos/query.dto";
import { GetSalariesDto, GetSalaryDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { CreateSalariesDto } from "./dtos/post.dto";
import { UpdateSalariesDto } from "./dtos/patch.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";

@Controller("salaries")
@ApiTags("Salary")
export class SalaryController {
  constructor(private salaryService: SalaryService) {}

  @GetValues(SalariesQueryDto, GetSalariesDto)
  async getSalaries(@Query("q") query: SalariesQueryDto) {
    const ans = await this.salaryService.getSalaries(query);

    return pipeTransformArray(ans, GetSalariesDto);
  }

  @GetValue(GetSalaryDto)
  async getSalary(@Param("id", new ParseUUIDPipe()) id: string) {
    const ans = await this.salaryService.getSalary(id);

    return pipeTransform(ans, GetSalaryDto);
  }

  @PostValues(CreateSalariesDto)
  async createSalaries(@Body(createArrayPipe(CreateSalariesDto)) salaries: CreateSalariesDto[]) {
    const ans = await this.salaryService.createSalaries(salaries);

    return ans;
  }

  @PatchValues(UpdateSalariesDto)
  async updateSalaries(@Body(createArrayPipe(UpdateSalariesDto)) salaries: UpdateSalariesDto[]) {
    const pr = salaries.map((salary) => this.salaryService.updateSalary(salary));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @DeleteValues()
  async deleteSalaries(@Query() query: DeleteValuesDto) {
    const ans = await this.salaryService.deleteSalaries(query.id);

    return ans;
  }
}

import {
  Controller,
  Inject,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Put,
  UseGuards,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { SALARY_SERVICE } from "src/constants";
import { JobIdParamDto } from "src/dtos/job";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { UpdateOrFind } from "src/utils/utils";
import { Salary } from "src/entities/Salary";
import { CreateSalariesDto, SalaryIdParamDto, UpdateSalaryDto } from "src/dtos/salary";
import SalaryService from "src/services/SalaryService";

@Controller("/jobs/:jobId/salary")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class SalaryController {
  constructor(@Inject(SALARY_SERVICE) private salaryService: SalaryService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getSalaries(@Param() param: JobIdParamDto) {
    const salaries = await this.salaryService.getSalaries({ jobId: param.jobId });
    return { salaries: salaries };
  }

  // @Post()
  // @UseInterceptors(ClassSerializerInterceptor)
  // @UseInterceptors(TransactionInterceptor)
  // async createSalaries(
  //   @Param() param: JobIdParamDto,
  //   @Body() body: CreateSalariesDto,
  //   @TransactionParam() transaction: Transaction
  // ) {
  //   const promises = [];
  //   for (const salary of body.salaries) {
  //     promises.push(
  //       this.salaryService.createOrGetSalary(
  //         new Salary({
  //           jobId: param.jobId,
  //           salary: salary.salary,
  //           salaryPeriod: salary.salaryPeriod,
  //           metadata: salary.metadata,
  //           constraints: salary.constraints,
  //         }),
  //         transaction
  //       )
  //     );
  //   }
  //   const salaries = await Promise.all(promises);
  //   return { salaries: salaries };
  // }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async createSalaries(
    @Param() param: JobIdParamDto,
    @Body() body: CreateSalariesDto,
    @TransactionParam() transaction: Transaction
  ) {
    const salaryArray = body.salaries.map(salary => {
      return {
        jobId: param.jobId,
        salary: salary.salary,
        salaryPeriod: salary.salaryPeriod,
        metadata: salary.metadata,
        constraints: salary.constraints,
      };
    });

    const salaries = await this.salaryService.bulkCreateSalaries(salaryArray, transaction);

    return { salaries: salaries };
  }

  @Put("/:salaryId")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async updateSalary(@Param() param: JobIdParamDto & SalaryIdParamDto, @Body() body: UpdateSalaryDto) {
    const [salary] = await this.salaryService.getSalaries({
      id: param.salaryId,
    });
    if (!salary) {
      throw new HttpException(`Salary with SalaryId: ${param.salaryId} not found`, HttpStatus.NOT_FOUND);
    }

    const newSalary = await UpdateOrFind(param.salaryId, body, this.salaryService, "updateSalary", "getSalaries");
    return { salary: newSalary };
  }

  @Delete("/:salaryId")
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteSalary(@Param() param: JobIdParamDto & SalaryIdParamDto) {
    const [salary] = await this.salaryService.getSalaries({
      id: param.salaryId,
    });
    if (!salary) {
      throw new HttpException(`Salary with SalaryId: ${param.salaryId} not found`, HttpStatus.NOT_FOUND);
    }
    const deleted = await this.salaryService.deleteSalary(param.salaryId);
    return { deleted: deleted };
  }
}

import { Module } from "@nestjs/common";
import { SalaryController } from "./salary.controller";
import { SalaryService } from "./salary.service";

@Module({
  controllers: [SalaryController],
  providers: [SalaryService],
})
export class SalaryModule {}

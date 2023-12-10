import { Controller, Get } from "@nestjs/common";
import { RecruiterService } from "./recruiter.service";

@Controller()
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterController) {}

  @Get()
  getHello(): string {
    return this.recruiterService.getHello();
  }
}

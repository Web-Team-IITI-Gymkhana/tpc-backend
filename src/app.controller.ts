import { Controller, Get } from "@nestjs/common";
import { appService } from "./app.service";

@Controller()
export class appController {
  constructor(private readonly appService: appService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

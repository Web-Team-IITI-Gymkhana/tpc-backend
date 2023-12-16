import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  Patch,
} from "@nestjs/common";
import { recruiterService } from "./recruiter.service";
import { recruiterDto } from "./recruiter.dto";
import { recruiterSearchDto } from "./recruiterSearch.dto";
import { recruiterUpdateDto } from "./recruiterUpdate.dto";

@Controller("admin/recruiter")
export class recruiterController {
  constructor(private readonly recruiterService: recruiterService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  createRecruiter(@Body() recruiter: recruiterDto): Promise<any> {
    return this.recruiterService.createRecruiter(recruiter);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  getRecruiter(@Body() recruiter: recruiterSearchDto): Promise<any> {
    return this.recruiterService.get(recruiter);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  updateRecruiter(@Body() recruiter: recruiterUpdateDto): Promise<any> {
    return this.recruiterService.updateRecruiter(recruiter);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  deleteRecruiter(@Body() recruiter: any): Promise<any> {
    return this.recruiterService.delete(recruiter);
  }
}

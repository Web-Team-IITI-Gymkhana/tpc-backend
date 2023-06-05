import { companiesService } from './companies.service';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Delete,
  ForbiddenException,
  UnauthorizedException,
  Res,
  Req,
  Param,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { LoggerInterceptor } from 'src/interceptor/LoggerInterceptor';
import { TransactionInterceptor } from 'src/interceptor/TransactionInterceptor';
import { randomUUID } from 'crypto';
import { json } from 'sequelize';
import { companiesDto } from './companies.dto';

@UseInterceptors(new LoggerInterceptor())
@Controller('companies')
export class companiesController {
  constructor(private companiesService: companiesService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  createCompanies(@Body() company: companiesDto): Promise<any> {
    return this.companiesService.create(company);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  getCompanies(): Promise<any> {
    return this.companiesService.get();
  }

  @Patch(':company_id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  updateCompanies(@Param('company_id') company_id: typeof randomUUID, @Body() company: companiesDto): Promise<any> {
    return this.companiesService.update(company_id, company);
  }

  @Delete(':company_id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  deleteCompanies(@Param('company_id') company_id: typeof randomUUID): Promise<any> {
    return this.companiesService.delete(company_id);
  }
}

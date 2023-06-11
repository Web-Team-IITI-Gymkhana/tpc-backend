import { companiesContactsService } from './companies_contacts.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Delete,
  ForbiddenException,
  UnauthorizedException,
  Param,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { LoggerInterceptor } from 'src/interceptor/LoggerInterceptor';
import { TransactionInterceptor } from 'src/interceptor/TransactionInterceptor';
import { randomUUID } from 'crypto';
import { json } from 'sequelize';
import { companiesContactDto } from './companiesContact.dto';

@UseInterceptors(new LoggerInterceptor())
@Controller('companies/:company_id/contacts')
export class companiesContactsController {
  constructor(private companiesContactsService: companiesContactsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  createCompaniesContacts(
    @Param('company_id') company_id: typeof randomUUID,
    @Body() companyContact: companiesContactDto,
  ): Promise<any> {
    return this.companiesContactsService.create(company_id, companyContact);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  getCompanies(@Param('company_id') company_id: typeof randomUUID): Promise<any> {
    return this.companiesContactsService.get(company_id);
  }

  @Patch(':contact_id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  updateCompaniesContact(@Param() params: any, @Body() companyContact: companiesContactDto): Promise<any> {
    return this.companiesContactsService.update(params.contact_id, companyContact);
  }

  @Delete(':contact_id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  deleteCompaniesContact(@Param() params: any): Promise<any> {
    return this.companiesContactsService.delete(params.contact_id);
  }
}

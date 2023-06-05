import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/db/database.module';
import { companiesContactsController } from './companies_contacts.controller';
import { companiesContactsService } from './companies_contacts.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [DatabaseModule],
  controllers: [companiesContactsController],
  providers: [ConfigService, companiesContactsService],
})
export class CompaniesContactsModule {}

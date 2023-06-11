import { Module } from '@nestjs/common';
import { companiesContactsController } from './companies_contacts.controller';
import { companiesContactsService } from './companies_contacts.service';
import { ConfigService } from '@nestjs/config';
import { databaseModule } from 'src/db/database.module';

@Module({
  imports: [databaseModule],
  controllers: [companiesContactsController],
  providers: [ConfigService, companiesContactsService],
})
export class companiesContactsModule {}

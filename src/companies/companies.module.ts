import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/db/database.module';
import { ConfigService } from '@nestjs/config';
import { companiesController } from './companies.controller';
import { companiesService } from './companies.service';

@Module({
  imports: [DatabaseModule],
  controllers: [companiesController],
  providers: [ConfigService, companiesService],
})
export class CompaniesModule {}

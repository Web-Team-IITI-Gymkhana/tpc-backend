import { ConfigModule } from '@nestjs/config';

import { AppController } from './controller/AppController';
import { TransactionInterceptor } from './interceptor/TransactionInterceptor';

import { DatabaseModule } from './db/database.module';

import { Logger, Module } from '@nestjs/common';
// import { CompaniesModule } from './companies/companies.module';
// import { CompaniesContactsModule } from './companies_contacts/companies_contacts.module';
// import { TeamModule } from './team/team.module';
// import { SeasonsJobsModule } from './seasons_jobs/seasons_jobs.module';
// import { SeasonsJobsEventsModule } from './seasons_jobs_events/seasons_jobs_events.module';
// import { SeasonsJobsAssignModule } from './seasons_jobs_assign/seasons_jobs_assign.module';
// import { SeasonsJobsStatusModule } from './seasons_jobs_status/seasons_jobs_status.module';
// import { SeasonsStudentsModule } from './seasons_students/seasons_students.module';
// import { SeasonsStudentsOffersModule } from './seasons_students_offers/seasons_students_offers.module';
import { SeasonsModule } from './seasons/seasons.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, SeasonsModule],
  controllers: [AppController],
  providers: [Logger, TransactionInterceptor],
})
export class AppModule {}

// CompaniesModule,
// CompaniesContactsModule,
// TeamModule,
// SeasonsJobsModule,
// SeasonsJobsEventsModule,
// SeasonsJobsAssignModule,
// SeasonsJobsStatusModule,
// SeasonsStudentsModule,
// SeasonsStudentsOffersModule,

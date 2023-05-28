import { ConfigModule } from '@nestjs/config';

import { AppController } from './controller/AppController';
import { TransactionInterceptor } from './interceptor/TransactionInterceptor';

import { DatabaseModule } from './db/database.module';

import { Logger, Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule],
  controllers: [AppController],
  providers: [Logger, TransactionInterceptor],
})
export class AppModule {}

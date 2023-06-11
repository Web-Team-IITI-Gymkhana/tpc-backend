import { Module } from '@nestjs/common';
import { databaseModule } from 'src/db/database.module';
import { seasonsController } from './seasons.controller';
import { seasonsService } from './seasons.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [databaseModule],
  controllers: [seasonsController],
  providers: [ConfigService, seasonsService],
})
export class seasonsModule {}

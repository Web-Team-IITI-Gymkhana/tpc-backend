import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/db/database.module';
import { seasonsController } from './seasons.controller';
import { seasonsService } from './seasons.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [DatabaseModule],
  controllers: [seasonsController],
  providers: [ConfigService, seasonsService],
})
export class SeasonsModule {}

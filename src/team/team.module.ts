import { Module } from '@nestjs/common';
import { databaseModule } from 'src/db/database.module';
import { ConfigService } from '@nestjs/config';
import { teamController } from './team.controller';
import { teamService } from './team.service';
import Sequelize from 'sequelize-typescript';

@Module({
  imports: [databaseModule],
  controllers: [teamController],
  providers: [ConfigService, teamService],
})
export class teamModule {}

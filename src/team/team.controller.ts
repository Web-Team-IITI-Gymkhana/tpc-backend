import { teamService } from './team.service';
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
import { teamDto } from './team.dto';

@UseInterceptors(new LoggerInterceptor())
@Controller('team')
export class teamController {
  constructor(private teamservice: teamService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  createteam(@Body() team: teamDto): Promise<any> {
    console.log(team);

    return this.teamservice.create(team);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  getTeams(): Promise<any> {
    return this.teamservice.get();
  }

  @Patch(':contact_id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  updateteam(@Param('contact_id') contact_id: typeof randomUUID, @Body() company: teamDto): Promise<any> {
    return this.teamservice.update(contact_id, company);
  }

  @Delete(':contact_id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  deleteteam(@Param('contact_id') contact_id: typeof randomUUID): Promise<any> {
    return this.teamservice.delete(contact_id);
  }
}

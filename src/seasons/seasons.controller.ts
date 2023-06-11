import { seasonsService } from './seasons.service';
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
} from '@nestjs/common';
import { LoggerInterceptor } from 'src/interceptor/LoggerInterceptor';
import { TransactionInterceptor } from 'src/interceptor/TransactionInterceptor';
import { randomUUID } from 'crypto';

@UseInterceptors(new LoggerInterceptor())
@Controller('seasons')
export class seasonsController {
  constructor(private seasonsService: seasonsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  createSeason(@Body() name: any): Promise<any> {
    return this.seasonsService.create(name.name);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  getSeason(): Promise<any> {
    return this.seasonsService.get();
  }

  @Delete(':season_id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  deleteSeason(@Param('season_id') season_id: typeof randomUUID): Promise<any> {
    return this.seasonsService.delete(season_id);
  }
}

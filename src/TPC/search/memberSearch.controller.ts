import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  Patch,
  Search,
} from "@nestjs/common";
import { memberSearchService } from "./memberSearch.service";
import { memberSearchDto } from "./memberSearch.dto";

@Controller("tpcCoordinator/search")
export class memberSearchController {
  constructor(private readonly memberSearchService: memberSearchService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  getMember(@Body() searchParams: memberSearchDto): Promise<any> {
    return this.memberSearchService.get(searchParams);
  }
}

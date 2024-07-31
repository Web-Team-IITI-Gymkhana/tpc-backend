import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { TpcMemberViewService } from "./tpc-member-view.service";
import { CreateTpcMemberViewDto } from "./dto/create-tpc-member-view.dto";
import { UpdateTpcMemberViewDto } from "./dto/update-tpc-member-view.dto";

@Controller("tpc-member-view")
export class TpcMemberViewController {
  constructor(private readonly tpcMemberViewService: TpcMemberViewService) {}

  @Post()
  create(@Body() createTpcMemberViewDto: CreateTpcMemberViewDto) {
    return this.tpcMemberViewService.create(createTpcMemberViewDto);
  }

  @Get()
  findAll() {
    return this.tpcMemberViewService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tpcMemberViewService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTpcMemberViewDto: UpdateTpcMemberViewDto) {
    return this.tpcMemberViewService.update(+id, updateTpcMemberViewDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tpcMemberViewService.remove(+id);
  }
}

import { Controller, Get, Query, Param, Post, Body, Patch, Delete } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { EventService } from "./event.service";
import { ApplicationQueryDto, EventQueryDto } from "./dtos/query.dto";
import { ApiFilterQuery, createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { GetEventReturnDto, GetEventsReturnDto } from "./dtos/get.dto";
import { CreateEventDto } from "./dtos/post.dto";
import { AddApplicantsDto, UpdateEventsDto } from "./dtos/patch.dto";

@Controller("event")
@ApiTags("Event")
export class EventController {
  constructor(private eventService: EventService) {}

  @Get()
  @ApiFilterQuery("q", EventQueryDto)
  @ApiOperation({ description: "Refer EventQueryDto for the schema." })
  @ApiResponse({ type: GetEventsReturnDto, isArray: true })
  async getEvents(@Query("q") where: EventQueryDto) {
    const ans = await this.eventService.getEvents(where);

    return pipeTransformArray(ans, GetEventsReturnDto);
  }

  @Get("/:id")
  @ApiFilterQuery("q", ApplicationQueryDto)
  @ApiOperation({ description: "Refer ApplicationQueryDto for the schema." })
  @ApiResponse({ type: GetEventReturnDto })
  async getEvent(@Param("id") id: string, @Query("q") where: ApplicationQueryDto) {
    const ans = await this.eventService.getEvent(id, where);

    return pipeTransform(ans, GetEventReturnDto);
  }

  @Post()
  @ApiBody({ type: CreateEventDto, isArray: true })
  async createEvents(@Body(createArrayPipe(CreateEventDto)) events: CreateEventDto[]) {
    const ans = await this.eventService.createEvents(events);

    return ans;
  }

  @Patch()
  @ApiBody({ type: UpdateEventsDto, isArray: true })
  async updateEvents(@Body(createArrayPipe(UpdateEventsDto)) events: UpdateEventsDto[]) {
    const pr = events.map((event) => this.eventService.updateEvent(event));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @Patch("/:eventId")
  async addApplications(@Param("eventId") eventId: string, @Body() application: AddApplicantsDto) {
    const ans = await this.eventService.addApplications(eventId, application.emails);

    return ans;
  }

  @Delete()
  async deleteEvents(@Query("id") ids: string | string[]) {
    const pids = typeof ids === "string" ? [ids] : ids;
    const ans = await this.eventService.deleteEvents(pids);

    return ans;
  }
}

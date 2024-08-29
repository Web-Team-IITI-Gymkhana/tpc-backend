import {
  Controller,
  Patch,
  Query,
  Body,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { EventService } from "./event.service";
import { ApiTags, ApiResponse, ApiBody, ApiParam, ApiQuery, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ApplicationsQueryDto, EventsQueryDto } from "./dtos/query.dto";
import { ApiFilterQuery, createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { GetEventDto, GetEventsDto } from "./dtos/get.dto";
import { CreateEventsDto } from "./dtos/post.dto";
import { AddApplicationsDto, UpdateEventsDto } from "./dtos/patch.dto";
import { DeleteValues, GetValue, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { QueryInterceptor } from "src/interceptor/QueryInterceptor";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";

@Controller("events")
@ApiTags("Event")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
export class EventController {
  constructor(private eventService: EventService) {}

  @GetValues(EventsQueryDto, GetEventsDto)
  async getEvents(@Query("q") where: EventsQueryDto) {
    const ans = await this.eventService.getEvents(where);

    return pipeTransformArray(ans, GetEventsDto);
  }

  @GetValue(GetEventDto)
  @ApiFilterQuery("q", ApplicationsQueryDto)
  @ApiOperation({ description: "Refer to ApplicationsQueryDto for details. " })
  @UseInterceptors(QueryInterceptor)
  async getEvent(@Param("id", new ParseUUIDPipe()) id: string, @Query("q") where: ApplicationsQueryDto) {
    const ans = await this.eventService.getEvent(id, where);

    return pipeTransform(ans, GetEventDto);
  }

  @PostValues(CreateEventsDto)
  async createEvents(@Body(createArrayPipe(CreateEventsDto)) events: CreateEventsDto[]) {
    const ans = await this.eventService.createEvents(events);

    return ans;
  }

  @PatchValues(UpdateEventsDto)
  async updateEvents(@Body(createArrayPipe(UpdateEventsDto)) events: UpdateEventsDto[]) {
    const pr = events.map((event) => this.eventService.updateEvent(event));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @Patch("/:eventId")
  @ApiParam({ name: "eventId", type: String })
  @ApiBody({ type: AddApplicationsDto })
  @ApiResponse({ type: Number })
  async updateApplications(
    @Param("eventId", new ParseUUIDPipe()) eventId: string,
    @Body() application: AddApplicationsDto
  ) {
    const ans = await this.eventService.updateApplications(eventId, application.studentIds);

    return ans;
  }

  @Delete("/applications")
  @ApiQuery({ name: "id", type: String, isArray: true })
  @ApiResponse({ type: Number })
  async deleteApplications(@Query() query: DeleteValuesDto) {
    const ans = await this.eventService.deleteApplications(query.id);

    return ans;
  }

  @DeleteValues()
  async deleteEvents(@Query() query: DeleteValuesDto) {
    const ans = await this.eventService.deleteEvents(query.id);

    return ans;
  }
}

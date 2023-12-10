import { facultyService } from "./faculty.service";
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
} from "@nestjs/common";

// import { eventDto } from "./event.dto";

// @UseInterceptors(new LoggerInterceptor())
@Controller("seasons/:season_id/jobs/:job_id/events")
export class facultyController {
  constructor(private facultyService: facultyService) {}
}

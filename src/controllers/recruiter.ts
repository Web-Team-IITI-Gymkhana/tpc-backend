import { Body, Controller, Inject, Post, UseInterceptors, ClassSerializerInterceptor, UseGuards } from "@nestjs/common";
import { RECRUITER_SERVICE } from "src/constants";
import RecruiterService from "src/services/RecruiterService";
import { Recruiter } from "src/entities/Recruiter";
import { AddRecruiterDto } from "../dtos/recruiter";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@Controller("/recruiters")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class RecruiterController {
  constructor(@Inject(RECRUITER_SERVICE) private recruiterService: RecruiterService) {}
}

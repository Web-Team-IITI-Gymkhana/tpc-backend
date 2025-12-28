import { Controller, Get, Query, Param, UseGuards } from "@nestjs/common";
import { AdminFeedbackService } from "./admin-feedback.service";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";

import { GetFeedbackSeasonDto } from "./dtos/get-seasons.dto";
import { GetFeedbackCompanyDto } from "./dtos/get-companies.dto";
import { RecruiterFeedbackItemDto } from "./dtos/get-feedback.dto";

@Controller("admin/feedback")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
export class AdminFeedbackController {
  constructor(private readonly service: AdminFeedbackService) {}

  /* ================= API 1 ================= */
  // GET /api/v1/admin/feedback/seasons
  @Get("seasons")
  async getSeasons(): Promise<GetFeedbackSeasonDto[]> {
    return this.service.getSeasonsWithFeedback();
  }

  /* ================= API 2 ================= */
  // GET /api/v1/admin/feedback/companies?seasonId=UUID
  @Get("companies")
  async getCompaniesForSeason(
    @Query("seasonId") seasonId: string,
  ): Promise<GetFeedbackCompanyDto[]> {
    return this.service.getCompaniesForSeason(seasonId);
  }

  /* ================= API 3 ================= */
  // GET /api/v1/admin/feedback/:companyId?seasonId=UUID
  @Get(":companyId")
  async getFeedbacks(
    @Param("companyId") companyId: string,
    @Query("seasonId") seasonId: string,
  ): Promise<RecruiterFeedbackItemDto[]> {
    return this.service.getFeedbacksForCompany(companyId, seasonId);
  }
}

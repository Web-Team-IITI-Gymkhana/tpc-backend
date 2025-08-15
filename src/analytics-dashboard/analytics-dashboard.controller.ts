import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UnauthorizedException } from "@nestjs/common";
import { AnalyticsDashboardService } from "./analytics-dashboard.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { User } from "src/decorators/User";
import { IUser } from "src/auth/User";
import {
  CategoryWiseStatsDto,
  CourseWiseStatsDto,
  DepartmentWiseStatsDto,
  GenderWiseStatsDto,
  AcademicWiseStatsDto,
  StatsDto,
  SeasonStatsDto,
} from "./dto/get.dto";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";

@Controller("analytics-dashboard")
@UseGuards(AuthGuard("jwt"))
@ApiTags("analytics-dashboard")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
export class AnalyticsDashboardController {
  constructor(private readonly analyticsDashboardService: AnalyticsDashboardService) {}

  @Get("statsOverall/:seasonId")
  @ApiResponse({ type: StatsDto })
  async getPlacementStatisticsOverall(@Param("seasonId") seasonId: string, @User() user: IUser) {
    if (user.role !== "ADMIN" && user.role !== "TPC_MEMBER") {
      throw new UnauthorizedException("You are not authorized to access this resource");
    }

    return this.analyticsDashboardService.getStatsOverall(seasonId);
  }
  @Get("statsCourseWise/:seasonId")
  @ApiResponse({ type: CourseWiseStatsDto })
  async getPlacementStatisticsCourseWise(@Param("seasonId") seasonId: string, @User() user: IUser) {
    if (user.role !== "ADMIN" && user.role !== "TPC_MEMBER") {
      throw new UnauthorizedException("You are not authorized to access this resource");
    }

    return this.analyticsDashboardService.getStatsCourseWise(seasonId);
  }
  @Get("statsDepartmentWise/:seasonId")
  @ApiResponse({ type: DepartmentWiseStatsDto })
  async getPlacementStatisticsDepartmentWise(@Param("seasonId") seasonId: string, @User() user: IUser) {
    if (user.role !== "ADMIN" && user.role !== "TPC_MEMBER") {
      throw new UnauthorizedException("You are not authorized to access this resource");
    }

    return this.analyticsDashboardService.getStatsDepartmentWise(seasonId);
  }
  @Get("statsCategoryWise/:seasonId")
  @ApiResponse({ type: CategoryWiseStatsDto })
  async getPlacementStatisticsCategoryWise(@Param("seasonId") seasonId: string, @User() user: IUser) {
    if (user.role !== "ADMIN" && user.role !== "TPC_MEMBER") {
      throw new UnauthorizedException("You are not authorized to access this resource");
    }

    return this.analyticsDashboardService.getStatsCategoryWise(seasonId);
  }
  @Get("statsGenderWise/:seasonId")
  @ApiResponse({ type: GenderWiseStatsDto })
  async getPlacementStatisticsGenderWise(@Param("seasonId") seasonId: string, @User() user: IUser) {
    if (user.role !== "ADMIN" && user.role !== "TPC_MEMBER") {
      throw new UnauthorizedException("You are not authorized to access this resource");
    }

    return this.analyticsDashboardService.getStatsGenderWise(seasonId);
  }

  @Get("statsAcademicWise/:seasonId")
  @ApiResponse({ type: AcademicWiseStatsDto })
  async getPlacementStatisticsAcademicWise(@Param("seasonId") seasonId: string, @User() user: IUser) {
    if (user.role !== "ADMIN" && user.role !== "TPC_MEMBER") {
      throw new UnauthorizedException("You are not authorized to access this resource");
    }

    return this.analyticsDashboardService.getStatsAcademicWise(seasonId);
  }

  @Get("getSeasonStats/:seasonId")
  @ApiResponse({ type: SeasonStatsDto })
  async getPlacementStats(@Param("seasonId") seasonId: string, @User() user: IUser) {
    if (user.role !== "ADMIN" && user.role !== "TPC_MEMBER") {
      throw new UnauthorizedException("You are not authorized to access this resource");
    }

    return this.analyticsDashboardService.getSeasonStats(seasonId);
  }
}

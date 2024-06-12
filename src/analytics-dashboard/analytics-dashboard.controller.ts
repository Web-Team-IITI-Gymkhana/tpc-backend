import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UnauthorizedException } from "@nestjs/common";
import { AnalyticsDashboardService } from "./analytics-dashboard.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { User } from "src/decorators/User";
import { IUser } from "src/auth/User";

@Controller("analytics-dashboard")
@UseGuards(AuthGuard("jwt"))
@ApiTags("analytics-dashboard")
@ApiBearerAuth("jwt")
export class AnalyticsDashboardController {
  constructor(private readonly analyticsDashboardService: AnalyticsDashboardService) {}

  @Get("statsOverall/:seasonId")
  async getPlacementStatisticsOverall(@Param("seasonId") seasonId: string, @User() user: IUser) {
    /*
     * if (user.role !== "ADMIN") {
     *   throw new UnauthorizedException("You are not authorized to access this resource");
     * }
     */

    return this.analyticsDashboardService.getStatsOverall(seasonId);
  }
  @Get("statsCourseWise/:seasonId")
  async getPlacementStatisticsCourseWise(@Param("seasonId") seasonId: string, @User() user: IUser) {
    /*
     * if (user.role !== "ADMIN") {
     *   throw new UnauthorizedException("You are not authorized to access this resource");
     * }
     */

    return this.analyticsDashboardService.getStatsCourseWise(seasonId);
  }
  @Get("statsDepartmentWise/:seasonId")
  async getPlacementStatisticsDepartmentWise(@Param("seasonId") seasonId: string, @User() user: IUser) {
    /*
     * if (user.role !== "ADMIN") {
     *   throw new UnauthorizedException("You are not authorized to access this resource");
     * }
     */

    return this.analyticsDashboardService.getStatsDepartmentWise(seasonId);
  }
  @Get("statsCategoryWise/:seasonId")
  async getPlacementStatisticsCategoryWise(@Param("seasonId") seasonId: string, @User() user: IUser) {
    /*
     * if (user.role !== "ADMIN") {
     *   throw new UnauthorizedException("You are not authorized to access this resource");
     * }
     */

    return this.analyticsDashboardService.getStatsCategoryWise(seasonId);
  }
  @Get("statsGenderWise/:seasonId")
  async getPlacementStatisticsGenderWise(@Param("seasonId") seasonId: string, @User() user: IUser) {
    /*
     * if (user.role !== "ADMIN") {
     *   throw new UnauthorizedException("You are not authorized to access this resource");
     * }
     */

    return this.analyticsDashboardService.getStatsGenderWise(seasonId);
  }
}

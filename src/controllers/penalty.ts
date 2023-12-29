import {
  Controller,
  Inject,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { PENALTY_SERVICE } from "src/constants";
import { createPenaltyDto, penaltyIdParamDto, updatePenaltyDto } from "src/dtos/penalty";
import { studentIdParamDto } from "src/dtos/student";
import PenaltyService from "src/services/PenaltyService";
import { Penalty } from "src/entities/Penalty";

@Controller("/students/:studentId/penalty")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class PenaltyController {
  constructor(@Inject(PENALTY_SERVICE) private penaltyService: PenaltyService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllPenalties(@Param() param: studentIdParamDto) {
    const penalties = await this.penaltyService.getPenalties({ studentId: param.studentId });
    return { penalties: penalties };
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async createPenalty(@Param() param: studentIdParamDto, @Body() body: createPenaltyDto) {
    const newPenalty = await this.penaltyService.createPenalty(
      new Penalty({
        studentId: param.studentId,
        penalty: body.penalty,
        reason: body.reason,
      })
    );
    return { penalty: newPenalty };
  }

  @Put("/:penaltyId")
  @UseInterceptors(ClassSerializerInterceptor)
  async updatePenalty(@Param() updatePenalty: studentIdParamDto & penaltyIdParamDto, @Body() body: updatePenaltyDto) {
    const newPenalty = await this.penaltyService.updatePenalty(updatePenalty.penaltyId, body);
    return { penalty: newPenalty };
  }

  @Delete("/:penaltyId")
  @UseInterceptors(ClassSerializerInterceptor)
  async deletePenalty(@Param() deletePenalty: studentIdParamDto & penaltyIdParamDto) {
    const deleted = await this.penaltyService.deletePenalty(deletePenalty.penaltyId);
    return { deleted: deleted };
  }
}

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
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { PENALTY_SERVICE } from "src/constants";
import { CreatePenaltiesDto, PenaltyIdParamDto, UpdatePenaltyDto } from "src/dtos/penalty";
import { studentIdParamDto } from "src/dtos/student";
import PenaltyService from "src/services/PenaltyService";
import { Penalty } from "src/entities/Penalty";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";

@Controller("/students/:studentId/penalty")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class PenaltyController {
  constructor(@Inject(PENALTY_SERVICE) private penaltyService: PenaltyService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getPenalties(@Param() param: studentIdParamDto) {
    const penalties = await this.penaltyService.getPenalties({ studentId: param.studentId });
    return { penalties: penalties };
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async createPenalty(
    @Param() param: studentIdParamDto,
    @Body() body: CreatePenaltiesDto,
    @TransactionParam() transaction: Transaction
  ) {
    const promises = [];
    for (const penalty of body.penalties) {
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
            const newPenalty = await this.penaltyService.createPenalty(
              new Penalty({
                studentId: param.studentId,
                penalty: penalty.penalty,
                reason: penalty.reason,
              }),
              transaction
            );
            resolve(newPenalty);
          } catch (err) {
            reject(err);
          }
        })
      );
    }
    const penalties = await Promise.all(promises);
    return { penalties: penalties };
  }

  @Put("/:penaltyId")
  @UseInterceptors(ClassSerializerInterceptor)
  async updatePenalty(@Param() param: studentIdParamDto & PenaltyIdParamDto, @Body() body: UpdatePenaltyDto) {
    const [penalty] = await this.penaltyService.getPenalties({ id: param.penaltyId });
    if (!penalty) {
      throw new HttpException(`Penalty with PenaltyId: ${param.penaltyId} not found`, HttpStatus.NOT_FOUND);
    }
    const newPenalty = await this.penaltyService.updatePenalty(param.penaltyId, body);
    return { penalty: newPenalty };
  }

  @Delete("/:penaltyId")
  @UseInterceptors(ClassSerializerInterceptor)
  async deletePenalty(@Param() param: studentIdParamDto & PenaltyIdParamDto) {
    const [penalty] = await this.penaltyService.getPenalties({
      id: param.penaltyId,
    });
    if (!penalty) {
      throw new HttpException(`penalty with penaltyId: ${param.penaltyId} not found`, HttpStatus.NOT_FOUND);
    }
    const deleted = await this.penaltyService.deletePenalty(param.penaltyId);
    return { deleted: deleted };
  }
}

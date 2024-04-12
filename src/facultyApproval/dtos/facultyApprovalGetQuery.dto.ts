import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, IsNumber, IsEnum, ValidateNested, IsUUID, IsEmail } from "class-validator";
import { FacultyApprovalStatusEnum } from "src/enums/facultyApproval.enum";
import { OrderByEnum } from "src/enums/orderBy.enum";
import { MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

class FilterOptionsFacultyApprovalDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  facultyApprovalId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  facultyId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  facultyName?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  facultyEmail?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  jobId?: string;

  @ApiPropertyOptional({ enum: FacultyApprovalStatusEnum, enumName: "ApprovalStatus" })
  @IsEnum(FacultyApprovalStatusEnum)
  @IsOptional()
  status?: FacultyApprovalStatusEnum;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  remark?: string;
}

class OrderOptionsFacultyApprovalDto {
  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  facultyApprovalId?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  facultyId?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  facultyName?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  facultyEmail?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  jobId?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  status?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  remark?: OrderByEnum;
}

export class FacultyApprovalGetQueryDto {
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  from?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  to?: number;

  @ApiPropertyOptional({
    type: FilterOptionsFacultyApprovalDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsFacultyApprovalDto)
  filterBy?: FilterOptionsFacultyApprovalDto;

  @ApiPropertyOptional({
    type: OrderOptionsFacultyApprovalDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsFacultyApprovalDto)
  orderBy?: OrderOptionsFacultyApprovalDto;
}

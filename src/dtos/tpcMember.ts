import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsOptional, ValidateNested } from "class-validator";
import { UUID } from "sequelize";
import { Category, TpcMemberRole } from "src/db/enums";

export class CreateTpcMemberDto {
  @ApiProperty({
    type: String,
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    type: String,
  })
  name: string;
  @ApiPropertyOptional()
  contact: string;
  @ApiProperty()
  role: TpcMemberRole;
  @ApiProperty()
  department: string;
}

export class AddTpcMembersDto {
  @ApiProperty({
    isArray: true,
    type: CreateTpcMemberDto,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateTpcMemberDto)
  tpcMembers: CreateTpcMemberDto[];
}

export class GetTpcMemberQueryDto {
  @ApiPropertyOptional()
  id?: string;
  @ApiPropertyOptional()
  userId?: string;
  @ApiPropertyOptional()
  department?: string;
  @ApiPropertyOptional({ enum: TpcMemberRole })
  role?: Category;
}

export class TpcMemberIdParamDto {
  @ApiProperty({
    type: UUID,
  })
  tpcMemberId: string;
}

export class UpdateTpcMemberDto {
  @ApiProperty({
    type: String,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    type: String,
  })
  name?: string;

  @ApiPropertyOptional()
  contact?: string;

  @ApiProperty()
  role?: TpcMemberRole;

  @ApiProperty()
  department?: string;
}

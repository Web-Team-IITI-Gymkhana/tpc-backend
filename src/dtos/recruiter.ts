import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsOptional, ValidateNested } from "class-validator";

export class AddRecruiterDto {
  @ApiProperty({
    type: String,
  })
  userId: string;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
  })
  contact: string;
}

export class AddRecruitersDto {
  @ApiProperty({
    isArray: true,
    type: AddRecruiterDto,
  })
  @ValidateNested({ each: true })
  @Type(() => AddRecruiterDto)
  recruiters: AddRecruiterDto[];
}

export class RecruiterIdParamDto {
  @ApiProperty({
    type: String,
  })
  recruiterId: string;
}

export class UpdateRecruiterDto {
  @ApiProperty({
    type: String,
  })
  companyId?: string;
  @ApiProperty()
  name?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  contact?: string;

  @ApiProperty()
  role?: string;
}

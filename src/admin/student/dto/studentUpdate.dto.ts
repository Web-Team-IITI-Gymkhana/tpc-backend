import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { studentSearchDto } from "./studentSearch.dto";
import { Type } from "class-transformer";

export class studentUpdateDto {
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => studentSearchDto)
  update: studentSearchDto;
}

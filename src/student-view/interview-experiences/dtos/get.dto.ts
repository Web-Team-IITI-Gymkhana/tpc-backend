import { NestedEnum, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";
import { SeasonTypeEnum } from "src/enums";

class SeasonDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  year: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: SeasonTypeEnum;
}

class CompanyDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;
}

export class GetInterviewExperiencesDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  studentName: string;

  @NestedString({})
  filename: string;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;
}

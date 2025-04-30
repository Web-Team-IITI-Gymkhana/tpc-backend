import {
  NestedBoolean,
  NestedDate,
  NestedEmail,
  NestedEnum,
  NestedNumber,
  NestedString,
  NestedUUID,
} from "src/decorators/dto";

export class GetExternalOpportunitiesDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  company: string;

  @NestedDate({})
  lastdate: string;

  @NestedString({})
  link: string;
}

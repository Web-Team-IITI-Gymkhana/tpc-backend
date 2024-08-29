import {
  NestedBoolean,
  NestedDate,
  NestedEmail,
  NestedEnum,
  NestedNumber,
  NestedString,
  NestedUUID,
} from "src/decorators/dto";

export class UpdateExternalOpportunitiesDto {
  @NestedUUID({})
  id: string;

  @NestedString({ optional: true })
  company?: string;

  @NestedDate({ optional: true })
  lastdate?: Date;

  @NestedString({ optional: true })
  link?: string;
}

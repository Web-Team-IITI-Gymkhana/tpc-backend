import { NestedDate, NestedString } from "src/decorators/dto";

export class PostExternalOpportunitiesDto {
  @NestedString({})
  company: string;

  @NestedDate({})
  lastdate: Date;

  @NestedString({})
  link: string;
}

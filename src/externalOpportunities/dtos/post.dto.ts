import { NestedDate, NestedString } from "src/decorators/dto";

export class PostExternalOpportunitiesDto {
  @NestedString({})
  company: string;

  @NestedString({})
  lastdate: string;

  @NestedString({})
  link: string;
}

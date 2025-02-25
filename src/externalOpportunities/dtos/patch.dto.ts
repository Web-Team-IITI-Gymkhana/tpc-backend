import { NestedUUID } from "src/decorators/dto";
import { PostExternalOpportunitiesDto } from "./post.dto";

export class PatchExternalOpportunitiesDto extends PostExternalOpportunitiesDto {
  @NestedUUID({})
  id: string;
}

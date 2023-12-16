import { IsNotEmpty, IsUUID } from "class-validator";
import { randomUUID } from "crypto";

export class studentDeleteDto {
  @IsNotEmpty()
  @IsUUID()
  id: typeof randomUUID;
}

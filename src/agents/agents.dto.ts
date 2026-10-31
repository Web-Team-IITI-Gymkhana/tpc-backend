import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AgentsChatDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  query: string;
}

import { ApiProperty } from "@nestjs/swagger";

export class RecruiterFeedbackSeasonDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  year: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  feedbackSubmitted: boolean;
}

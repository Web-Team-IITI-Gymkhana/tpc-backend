import { BadRequestException } from "@nestjs/common";
import { BacklogEnum } from "src/enums";

export function validateBacklogCount(backlog: BacklogEnum | null | undefined, count: number | null | undefined) {
  // Existing ACTIVE students may not yet have supplied their count.
  if (count == null) {
    if (backlog === BacklogEnum.NEVER || backlog === BacklogEnum.PREVIOUS) {
      throw new BadRequestException("Students without active backlogs must have a count of 0");
    }
    return;
  }

  if (!Number.isSafeInteger(count) || count < 0) {
    throw new BadRequestException("Number of backlogs must be a nonnegative integer");
  }
  if (backlog == null) {
    throw new BadRequestException("Set a backlog status before the number of backlogs");
  }
  if (backlog === BacklogEnum.ACTIVE && count < 1) {
    throw new BadRequestException("Active backlogs require a count of at least 1");
  }
  if ((backlog === BacklogEnum.NEVER || backlog === BacklogEnum.PREVIOUS) && count !== 0) {
    throw new BadRequestException("Students without active backlogs must have a count of 0");
  }
}

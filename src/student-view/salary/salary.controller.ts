import { Body, Controller, Param, ParseUUIDPipe, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SalaryService } from "./salary.service";
import { GetValue, GetValues, PostValues } from "src/decorators/controller";
import { GetStudentSalariesDto, GetStudentSalaryDto } from "./dtos/get.dto";
import { StudentSalariesQueryDto } from "./dtos/query.dto";
import { User } from "src/decorators/User";
import { AuthGuard } from "@nestjs/passport";
import { IUser } from "src/auth/User";
import { createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { FileService } from "src/services/FileService";
import { JD_FOLDER } from "src/constants";
import path from "path";
import { ApplySalariesDto } from "./dtos/post.dto";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";

@Controller("student-view/salaries")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.STUDENT))
@ApiTags("Student-View/Salary")
@ApiBearerAuth("jwt")
export class SalaryController {
  folderPath = JD_FOLDER;

  constructor(
    private salaryService: SalaryService,
    private fileService: FileService
  ) {}

  @GetValues(StudentSalariesQueryDto, GetStudentSalariesDto)
  async getSalaries(@Query("q") where: StudentSalariesQueryDto, @User() user: IUser) {
    const registered = where.registered as boolean;
    const ans = await this.salaryService.getSalaries(where, user.studentId, registered);

    return pipeTransformArray(ans, GetStudentSalariesDto);
  }

  @GetValue(GetStudentSalaryDto)
  async getSalary(@Param("id", new ParseUUIDPipe()) id: string, @User() user: IUser) {
    const ans = await this.salaryService.getSalary(id, user.studentId);

    if (ans.job.attachments && ans.job.attachments.length > 0) {
      const files = [];
      for (const attachment of ans.job.attachments) {
        const file = await this.fileService.getFileasBuffer(path.join(this.folderPath, attachment));
        files.push(file.toString("base64"));
      }
      ans.job.attachments = files;
    }

    return pipeTransform(ans, GetStudentSalaryDto);
  }

  @PostValues(ApplySalariesDto)
  async applySalaries(@Body(createArrayPipe(ApplySalariesDto)) salaries: ApplySalariesDto[], @User() user: IUser) {
    const pr = salaries.map((salary) =>
      this.salaryService.applySalary(salary.salaryId, user.studentId, salary.resumeId, salary.additionalData)
    );
    const ans = await Promise.all(pr);

    return ans.flat();
  }
}

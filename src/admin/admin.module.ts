import { Module } from "@nestjs/common";
import { studentModule } from "./student/student.module";
import { recruiterModule } from "./recruiter/recruiter.module";
import { facultyModule } from "./faculty/faculty.module";
import { memberSearchModule } from "./search/memberSearch.module";

@Module({
  imports: [studentModule, recruiterModule, facultyModule, memberSearchModule],
})
export class adminModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { AdminModule } from './admin/admin.module';
import { RecruiterModule } from './recruiter/recruiter.module';

@Module({
  imports: [StudentModule, AdminModule, RecruiterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

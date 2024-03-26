import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./db/database.module";
import { JwtStrategy } from "./auth/JwtStrategy";
import { TransactionInterceptor } from "./interceptor/TransactionInterceptor";
import { QueryInterceptor } from "./interceptor/QueryInterceptor";
import { UserService } from "./services/UserService";
import { StudentModule } from "./student/student.module";
import { FlowerController } from "./example/example.controller";
import { RecruiterModule } from "./recruiter/recruiter.module";
import { TpcMemberModule } from "./tpcMember/tpcMember.module";
import { EmailService } from "./services/EmailService";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    { module: DatabaseModule, global: true },
    AuthModule,
    StudentModule,
    RecruiterModule,
    TpcMemberModule,
  ],
  controllers: [AppController, FlowerController],
  providers: [Logger, TransactionInterceptor, QueryInterceptor, AppService, UserService, EmailService],
})
export class AppModule {}

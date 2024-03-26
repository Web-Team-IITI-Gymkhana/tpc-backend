import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./db/database.module";
import { JwtStrategy } from "./auth/JwtStrategy";
import { TransactionInterceptor } from "./interceptor/TransactionInterceptor";
import { QueryInterceptor } from "./interceptor/QueryInterceptor";
import { AuthService } from "./auth/AuthService";
import { UserService } from "./auth/UserService";
import { AuthController } from "./auth/auth.controller";
import { StudentModule } from "./student/student.module";
import { FlowerController } from "./example/example.controller";
import { RecruiterModule } from "./recruiter/recruiter.module";

@Module({
  imports: [ConfigModule.forRoot(), { module: DatabaseModule, global: true }, StudentModule, RecruiterModule],
  controllers: [AppController, AuthController, FlowerController],
  providers: [Logger, JwtStrategy, TransactionInterceptor, QueryInterceptor, AppService, AuthService, UserService],
})
export class AppModule {}

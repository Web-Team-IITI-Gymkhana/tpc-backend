import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { StudentMiddleware } from './student.middleware';

@Module({
  imports:[],
  controllers: [StudentController],
  providers: [StudentService],
})

export class StudentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(StudentMiddleware).forRoutes('*')
  }
}

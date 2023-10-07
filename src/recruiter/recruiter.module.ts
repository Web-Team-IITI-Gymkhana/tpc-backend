import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { RecruiterController } from './recruiter.controller';
import { RecuiterMiddleware } from './recruiter.middleware';

@Module({
  controllers: [RecruiterController],
  providers: [RecruiterService],
})

export class RecruiterModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(RecuiterMiddleware).forRoutes('*')
  }
}
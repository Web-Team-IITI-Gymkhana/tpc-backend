import { INestApplication, LoggerService, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Helmet from 'helmet';
import { json } from 'express';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { isProductionEnv } from './utils/utils';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions, SwaggerCustomOptions } from '@nestjs/swagger';
import { HttpExceptionFilter } from './interceptor/ExceptionFilter';
import { LoggerInterceptor } from './interceptor/LoggerInterceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: createWinstonLogger(),
    cors: true,
  });
  app.setGlobalPrefix('v1', { exclude: [{ path: '/', method: RequestMethod.GET }] });
  if (!process.env.SWAGGER_ENABLE || process.env.SWAGGER_ENABLE === '1') {
    createSwagger(app);
  }
  app.use(json());
  app.use(Helmet());
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

/**
 * Register a Swagger module in the NestJS application.
 * This method mutates the given `app` to register a new module dedicated to
 * Swagger API documentation. Any request performed on /docs will
 * receive a documentation page as response. Check nestjs/swagger documentation
 * to customize this code below
 */
function createSwagger(app: INestApplication) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const version = require('../package.json').version || '0.1.0';

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API')
    .setVersion(version)
    .addTag('API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .addSecurity('jwt', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      controllerKey.replace('Controller', '') + '.' + methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  SwaggerModule.setup('/docs', app, document, customOptions);
}

function createWinstonLogger(): LoggerService {
  return WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        level: isProductionEnv() ? 'info' : 'debug',
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.align(),
          winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
        ),
      }),
    ],
  });
}

/**
 * It is now time to turn the lights on!
 * Any major error that can not be handled by NestJS will be caught in the code
 * below. The default behavior is to display the error on stdout and quit.
 *
 * @todo It is often advised to enhance the code below with an exception-catching
 *       service for better error handling in production environments.
 */
bootstrap().catch((err) => {
  // tslint:disable-next-line:no-console
  console.error(err);
  process.exit(1);
});

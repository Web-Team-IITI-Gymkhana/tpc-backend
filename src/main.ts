import { INestApplication, LoggerService, RequestMethod, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import Helmet from "helmet";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import { isProductionEnv } from "./utils/utils";
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions, SwaggerCustomOptions } from "@nestjs/swagger";
import { HttpExceptionFilter } from "./interceptor/ExceptionFilter";
import { LoggerInterceptor } from "./interceptor/LoggerInterceptor";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: createWinstonLogger(),
    cors: true,
  });
  app.setGlobalPrefix("api/v1", { exclude: [{ path: "/health", method: RequestMethod.GET }] });
  createSwagger(app);
  app.use(Helmet());
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      transform: true,
    })
  );

  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

function createSwagger(app: INestApplication) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const version = require("../package.json").version || "0.1.0";

  const config = new DocumentBuilder()
    .setTitle("TPC Backend API")
    .setDescription("API for tpc backedn")
    .setVersion(version)
    .addTag("TPCBackend")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      "jwt"
    )
    .addSecurity("jwt", {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    })
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      controllerKey.replace("Controller", "") + "." + methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  SwaggerModule.setup("/", app, document, customOptions);
}

function createWinstonLogger(): LoggerService {
  return WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        level: isProductionEnv() ? "info" : "debug",
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          winston.format.align(),
          winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
      }),
    ],
  });
}

bootstrap().catch((err) => {
  // tslint:disable-next-line:no-console
  console.error(err);
  process.exit(1);
});

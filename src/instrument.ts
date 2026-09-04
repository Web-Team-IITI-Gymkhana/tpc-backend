import * as Sentry from "@sentry/nestjs";
import * as dotenv from "dotenv";

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },
});

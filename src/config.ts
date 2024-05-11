import * as dotenv from "dotenv";

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IEnvironmentVariables {
  PORT: number;
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
  ROOT_DOCS_PATH: string;
  USER_SECRET: string;
  UPLOAD_DIR: string;
  RECRUITER_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  BACKEND_URL: string;
  FRONTEND_URL: string;
  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_USER: string;
  MAIL_PASSWORD: string;
  DEFAULT_MAIL_FROM: string;
  APP_NAME: string;
}

export function env(): IEnvironmentVariables {
  dotenv.config({ override: true });

  const ans: IEnvironmentVariables = {
    PORT: Number(process.env.PORT),
    DB_NAME: process.env.DB_NAME,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: Number(process.env.DB_PORT),
    ROOT_DOCS_PATH: process.env.ROOT_DOCS_PATH || "/api/v1",
    USER_SECRET: process.env.USER_SECRET,
    UPLOAD_DIR: process.env.UPLOAD_DIR,
    RECRUITER_SECRET: process.env.RECRUITER_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    BACKEND_URL: process.env.BACKEND_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    DEFAULT_MAIL_FROM: process.env.DEFAULT_MAIL_FROM,
    APP_NAME: process.env.APP_NAME,
  };

  for (const key in ans) {
    if (ans[key] === undefined) throw new Error(`${key} not found in environment variables`);
  }

  return ans;
}

import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { config } from "dotenv";

import { Injectable } from "@nestjs/common";
import { Profile } from "passport";
import { env } from "src/config";

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    const { GOOGLE_CLIENT_ID: clientID, GOOGLE_CLIENT_SECRET: clientSecret, BACKEND_URL } = env();
    super({
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: `${BACKEND_URL}/api/v1/auth/google/callback`,
      scope: ["email", "profile"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    const user = {
      email: profile.emails[0].value,
    };
    done(null, user);
  }
}

import { Injectable } from "@nestjs/common";
import { createHmac } from "crypto";

@Injectable()
export class SignedUrlService {
  private readonly SECRET = process.env.NGINX_SIGNED_URL_SECRET || "s3cR3tK3y123!@#";
  private readonly BASE_URL = process.env.FRONTEND_URL || "https://tpc.princecodes.online";
  private readonly DEFAULT_EXPIRY_MINUTES = 5;

  /**
   * Generate signed URL for resume files
   */
  generateSignedResumeUrl(filename: string, expiryMinutes: number = this.DEFAULT_EXPIRY_MINUTES): string {
    const uri = `/secure-resume/${filename}`;
    const expires = Math.floor(Date.now() / 1000) + 60 * expiryMinutes;
    const base = `${uri}${expires}`;
    const signature = createHmac("md5", this.SECRET).update(base).digest("base64url");

    return `${this.BASE_URL}${uri}?expires=${expires}&signature=${signature}`;
  }

  /**
   * Generate signed URL for JD files
   */
  generateSignedJdUrl(filename: string, expiryMinutes: number = this.DEFAULT_EXPIRY_MINUTES): string {
    const uri = `/secure-jd/${filename}`;
    const expires = Math.floor(Date.now() / 1000) + 60 * expiryMinutes;
    const base = `${uri}${expires}`;
    const signature = createHmac("md5", this.SECRET).update(base).digest("base64url");

    return `${this.BASE_URL}${uri}?expires=${expires}&signature=${signature}`;
  }

  /**
   * Generate signed URL for Interview Experience files
   */
  generateSignedIeUrl(filename: string, expiryMinutes: number = this.DEFAULT_EXPIRY_MINUTES): string {
    const uri = `/secure-ie/${filename}`;
    const expires = Math.floor(Date.now() / 1000) + 60 * expiryMinutes;
    const base = `${uri}${expires}`;
    const signature = createHmac("md5", this.SECRET).update(base).digest("base64url");

    return `${this.BASE_URL}${uri}?expires=${expires}&signature=${signature}`;
  }

  /**
   * Generate signed URL for Policy files
   */
  generateSignedPolicyUrl(filename: string, expiryMinutes: number = this.DEFAULT_EXPIRY_MINUTES): string {
    const uri = `/secure-policy/${filename}`;
    const expires = Math.floor(Date.now() / 1000) + 60 * expiryMinutes;
    const base = `${uri}${expires}`;
    const signature = createHmac("md5", this.SECRET).update(base).digest("base64url");

    return `${this.BASE_URL}${uri}?expires=${expires}&signature=${signature}`;
  }

  /**
   * Generic signed URL generator for any file type
   */
  generateSignedUrl(
    fileType: "resume" | "jd" | "ie" | "policy",
    filename: string,
    expiryMinutes: number = this.DEFAULT_EXPIRY_MINUTES
  ): string {
    switch (fileType) {
      case "resume":
        return this.generateSignedResumeUrl(filename, expiryMinutes);
      case "jd":
        return this.generateSignedJdUrl(filename, expiryMinutes);
      case "ie":
        return this.generateSignedIeUrl(filename, expiryMinutes);
      case "policy":
        return this.generateSignedPolicyUrl(filename, expiryMinutes);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  }
}

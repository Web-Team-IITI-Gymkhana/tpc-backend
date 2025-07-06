import { Injectable } from "@nestjs/common";
import { createHmac } from "crypto";

@Injectable()
export class SignedUrlService {
  private readonly SECRET = process.env.NGINX_SIGNED_URL_SECRET || "s3cR3tK3y123!@#";
  private readonly BASE_URL = process.env.BACKEND_URL || "https://tpc.princecodes.online";
  private readonly DEFAULT_EXPIRY_MINUTES = 10;

  /**
   * Encode buffer to base64 URL-safe format
   */
  private base64UrlEncode(buffer: Buffer): string {
    return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  /**
   * Generates HMAC-MD5 based signature in base64url format
   */
  private generateSignature(uri: string, expires: number): string {
    const base = `${uri}${expires}`;
    const hmac = createHmac("md5", this.SECRET).update(base).digest(); // binary
    return this.base64UrlEncode(hmac);
  }

  /**
   * Generate secure signed URL
   */
  private buildSignedUrl(path: string, expiryMinutes: number): string {
    const expires = Math.floor(Date.now() / 1000) + 60 * expiryMinutes;
    const signature = this.generateSignature(path, expires);
    return `${this.BASE_URL}${path}?expires=${expires}&signature=${signature}`;
  }

  /**
   * Public methods per file type
   */
  generateSignedResumeUrl(filename: string, expiryMinutes = this.DEFAULT_EXPIRY_MINUTES): string {
    return this.buildSignedUrl(`/secure-resume/${filename}`, expiryMinutes);
  }

  generateSignedJdUrl(filename: string, expiryMinutes = this.DEFAULT_EXPIRY_MINUTES): string {
    return this.buildSignedUrl(`/secure-jd/${filename}`, expiryMinutes);
  }

  generateSignedIeUrl(filename: string, expiryMinutes = this.DEFAULT_EXPIRY_MINUTES): string {
    return this.buildSignedUrl(`/secure-ie/${filename}`, expiryMinutes);
  }

  generateSignedPolicyUrl(filename: string, expiryMinutes = this.DEFAULT_EXPIRY_MINUTES): string {
    return this.buildSignedUrl(`/secure-policy/${filename}`, expiryMinutes);
  }

  generateSignedUrl(
    fileType: "resume" | "jd" | "ie" | "policy",
    filename: string,
    expiryMinutes = this.DEFAULT_EXPIRY_MINUTES
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

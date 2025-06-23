import axios from "axios";
import { env } from "../config";

/**
 * Verifies a reCAPTCHA token with Google's reCAPTCHA API
 * @param token The reCAPTCHA token from the client
 * @param recaptchaSecret The reCAPTCHA secret key
 * @throws {ForbiddenException} If the reCAPTCHA verification fails
 */
export async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const recaptchaSecret = env().RECAPTCHA_SECRET;
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${token}`
    );

    if (!response.data.success) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

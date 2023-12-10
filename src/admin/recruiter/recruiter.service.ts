import { Injectable } from "@nestjs/common";

@Injectable()
export class RecruiterService {
  getHello(): string {
    return "Hello World!";
  }
}

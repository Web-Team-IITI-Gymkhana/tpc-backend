import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { env } from "src/config";
import { AgentsRole } from "./agents.roles";

@Injectable()
export class AgentsService {
  createServiceToken(userId: string, role: AgentsRole, requestId: string): string {
    const config = env();

    if (!config.AGENTS_ENABLED || !config.AGENTS_SERVICE_SECRET) {
      throw new ServiceUnavailableException("Chatbot is currently unavailable");
    }

    return jwt.sign(
      { request_id: requestId, role },
      config.AGENTS_SERVICE_SECRET,
      {
        algorithm: "HS256",
        issuer: "tpc-backend",
        audience: "tpc-agents",
        subject: userId,
        jwtid: uuidv4(),
        expiresIn: 60,
      }
    );
  }
}

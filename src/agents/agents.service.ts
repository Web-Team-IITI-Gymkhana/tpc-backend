import {
  BadGatewayException,
  GatewayTimeoutException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import axios from "axios";
import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { env } from "src/config";
import { AgentsRole } from "./agents.roles";

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);
  private readonly inFlightUsers = new Set<string>();

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

  async ask(query: string, userId: string, role: AgentsRole, requestId: string): Promise<string> {
    const config = env();
    if (this.inFlightUsers.has(userId)) {
      throw new HttpException("Too many chatbot requests", HttpStatus.TOO_MANY_REQUESTS);
    }

    this.inFlightUsers.add(userId);
    try {
      const serviceToken = this.createServiceToken(userId, role, requestId);
      const url = `${config.AGENTS_SERVICE_URL.replace(/\/$/, "")}/django/api/rag/ask/`;
      const response = await axios.post<{ response: string }>(
        url,
        { query, role },
        {
          headers: {
            "X-Service-Token": serviceToken,
            "X-Request-Id": requestId,
          },
          timeout: config.AGENTS_TIMEOUT_MS,
        }
      );

      if (typeof response.data?.response !== "string") throw new BadGatewayException("Invalid chatbot response");

      return response.data.response;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") throw new GatewayTimeoutException("Chatbot request timed out");
        if (error.response) throw new BadGatewayException("Chatbot request failed");
      }

      throw new ServiceUnavailableException("Chatbot is currently unavailable");
    } finally {
      this.inFlightUsers.delete(userId);
    }
  }

  logAudit(userId: string, role: string, requestId: string, queryLength: number, status: number, latency: number): void {
    this.logger.log(
      JSON.stringify({
        event: "agents.chat",
        user_id: userId,
        role,
        request_id: requestId,
        query_length: queryLength,
        status,
        latency_ms: latency,
      })
    );
  }
}

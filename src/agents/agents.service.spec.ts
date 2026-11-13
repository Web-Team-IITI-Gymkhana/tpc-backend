import axios from "axios";
import * as jwt from "jsonwebtoken";
import { env } from "src/config";
import { RoleEnum } from "src/enums";
import { AgentsService } from "./agents.service";

jest.mock("axios");
jest.mock("src/config", () => ({ env: jest.fn() }));

describe("AgentsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (env as jest.Mock).mockReturnValue({
      AGENTS_ENABLED: true,
      AGENTS_SERVICE_SECRET: "test-service-secret",
      AGENTS_SERVICE_URL: "http://agents.local",
      AGENTS_TIMEOUT_MS: 30000,
    });
  });

  it("maps every portal role to its service role", () => {
    const service = new AgentsService();

    for (const role of Object.values(RoleEnum)) {
      expect(service.getServiceRole(role)).toBe(role.toLowerCase());
    }
  });

  it("sends only the query and signs the verified role", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { response: "answer" } });
    const service = new AgentsService();

    await expect(service.ask("help", "user-1", "faculty", "request-1")).resolves.toBe("answer");

    const [url, body, options] = (axios.post as jest.Mock).mock.calls[0];
    expect(url).toBe("http://agents.local/django/api/rag/ask/");
    expect(body).toEqual({ query: "help" });
    expect(options.maxRedirects).toBe(0);
    expect(
      jwt.verify(options.headers["X-Service-Token"], "test-service-secret", {
        audience: "tpc-agents",
        issuer: "tpc-backend",
      })
    ).toMatchObject({ sub: "user-1", role: "faculty", request_id: "request-1" });
  });
});

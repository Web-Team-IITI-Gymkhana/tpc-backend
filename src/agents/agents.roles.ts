import { ForbiddenException } from "@nestjs/common";
import { RoleEnum } from "src/enums";

export type AgentsRole = "student" | "recruiter" | "tpc_member" | "admin";

const roleMap: Partial<Record<RoleEnum, AgentsRole>> = {
  [RoleEnum.STUDENT]: "student",
  [RoleEnum.RECRUITER]: "recruiter",
  [RoleEnum.TPC_MEMBER]: "tpc_member",
  [RoleEnum.ADMIN]: "admin",
};

export function getAgentsRole(role: RoleEnum): AgentsRole {
  const agentsRole = roleMap[role];

  if (!agentsRole) throw new ForbiddenException("You are not allowed to use the chatbot");

  return agentsRole;
}

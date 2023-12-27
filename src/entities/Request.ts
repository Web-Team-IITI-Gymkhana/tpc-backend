import { Request } from "express";
import { User } from "./User";

export interface RequestDto extends Request {
  user: User;
}

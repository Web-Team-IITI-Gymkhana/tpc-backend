import { Request } from 'express';

export class User {}

export interface RequestDto extends Request {
  user: User;
}

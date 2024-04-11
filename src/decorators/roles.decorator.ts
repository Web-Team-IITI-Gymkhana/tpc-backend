import { SetMetadata } from "@nestjs/common";
import { ROLES_KEY } from "src/constants";
import { RoleEnum } from "src/enums";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);

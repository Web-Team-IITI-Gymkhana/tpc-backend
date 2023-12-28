import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Logger, Type, mixin } from "@nestjs/common";
import { JOB_SERVICE } from "src/constants";
import { Role } from "src/db/enums";
import { RequestDto } from "src/entities/Request";
import JobService from "src/services/JobService";

export enum ResourceType {
  JOB = "JOB",
  EVENT = "EVENT",
  SALARY = "SALARY",
  PENALTY = "PENALTY",
  RESUME = "RESUME",
}

export enum Action {
  READ = "READ",
  MANAGE = "MANAGE",
}

export type Provider = (any) => string;
export type IdResolver = (string) => string;
export type AsyncProvider = (any) => Promise<string>;

export const params = (field: string): Provider => {
  return (request: any) => {
    return request.params[field];
  };
};

export const asyncModifiedParams = (field: string, method: (string) => Promise<string>): AsyncProvider => {
  return (request: any) => {
    return method(request.params[field]);
  };
};

export const asyncModifiedQuery = (field: string, method: (string) => Promise<string>): AsyncProvider => {
  return (request: any) => {
    return method(request.query[field]);
  };
};

export const asyncModifiedBody = (field: string, method: (string) => Promise<string>): AsyncProvider => {
  return (request: any) => {
    return method(request.body[field]);
  };
};

export const body = (field: string): Provider => {
  return (request: any) => {
    return request.body[field];
  };
};

export const query = (field: string): Provider => {
  return (request: any) => {
    return request.query[field];
  };
};

export const nestedBody = (field1: string, field2: string): Provider => {
  return (request: any) => {
    return request.body[field1][field2];
  };
};

export const paramsWithResolver = (field: string, resolver: IdResolver): Provider => {
  return (request: any) => {
    const serviceId = <string>request.params[field];
    return resolver(serviceId);
  };
};

export const queryWithResolver = (field: string, resolver: IdResolver): Provider => {
  return (request: any) => {
    const serviceId = <string>request.query[field];
    return resolver(serviceId);
  };
};

export const bodyWithResolver = (field: string, resolver: IdResolver): Provider => {
  return (request: any) => {
    const serviceId = <string>request.body[field];
    return resolver(serviceId);
  };
};
export function RequireDynamicPermission(
  resourceTypeProvider: Provider,
  action: Action,
  resourceIdProvider?: Provider | AsyncProvider,
  isOptional = false
): Type<CanActivate> {
  class _RequirePermissions implements CanActivate {
    private readonly logger = new Logger(RequirePermissions.name);

    constructor(@Inject(JOB_SERVICE) private jobService: JobService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: RequestDto = context.switchToHttp().getRequest();
      const user = request.user;
      const userRole = user.role;
      const roleId = user.roleId;
      const resourceId = await resourceIdProvider(request);
      const resourceType = <ResourceType>resourceTypeProvider(request);

      if (!resourceId) {
        if (isOptional) {
          return true;
        }
        throw new HttpException(`Invalid ${resourceType} id`, 400);
      }

      // Let ADMIN pass
      if (userRole === Role.ADMIN) {
        return true;
      }

      if (!roleId) {
        throw new HttpException(`Invalid access token`, HttpStatus.UNAUTHORIZED);
      }

      if (resourceType === ResourceType.JOB && userRole === Role.RECRUITER) {
        const [job] = await this.jobService.getJobs({ id: resourceId, recruiterId: roleId });
        if (!job) {
          throw new HttpException(
            `You do not have requisite permission on this entity or it does not exist`,
            HttpStatus.FORBIDDEN
          );
        }
      }
    }
  }
  const guard = mixin(_RequirePermissions);
  return guard;
}

export const RequirePermissions = (
  resourceType: ResourceType,
  action: Action,
  resourceIdProvider?: Provider | AsyncProvider,
  isOptional = false
) => {
  return RequireDynamicPermission(() => resourceType, action, resourceIdProvider, isOptional);
};

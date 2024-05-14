import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class QueryInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<CallHandler>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();

    const fix = (query: unknown) => {
      if (typeof query !== "object") return query;

      for (const key in query) {
        let newKey = key;
        const obj = query[key];
        delete query[key];

        if (key === "[]") return [obj];
        else if (key[key.length - 1] === "]" && key[key.length - 2] === "[") {
          newKey = key.slice(1, -3);
          query[newKey] = [obj];
          continue;
        }
        if (key[0] === "[" && key[key.length - 1] === "]") newKey = key.slice(1, -1);
        query[newKey] = fix(obj);
      }

      return query;
    };

    req.query = fix(req.query);

    return next.handle();
  }
}

/*
 * This function is used to fix incorrectly formed nested objects in the query object.
 * The function is recursive and will fix all nested objects.
 * This are the cases it handles: {"[eq]": "name"}, {"[eq][]": "name"}, eq: {"[]": "name"}
 */

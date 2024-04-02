import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class QueryInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<CallHandler>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const query = req.query;
    const ans = {};

    for (const key in query) {
      const nestedValues = key.split("_");
      let target = ans;
      for (let index = 0; index < nestedValues.length - 1; index++) {
        const nestedKey = nestedValues[index];
        if (!target[nestedKey]) target[nestedKey] = {};
        target = target[nestedKey];
      }
      target[nestedValues[nestedValues.length - 1]] = query[key];
    }
    req.query = ans;

    return next.handle();
  }
}

/*
 *  The function assumes that the query params are given like so:
 * {'param1': 'value1', 'param2_nestedParam1': 'nestedValue1','param2_nestedParam2': 'nestedValue2'};
 *  for the required value:
 *  {
 *    param1: 'value1',
 *    param2: { nestedParam1: 'nestedValue1', nestedParam2: 'nestedValue2' }
 *  }
 */

/*
 * The encoding function is given below (To be used by frontend):
 *  const query = {
 *    param1: 'value1',
 *    param2: { nestedParam1: {value: 'nestedValue1'}, nestedParam2: 'nestedValue2' },
 *    param3: [1,2,3]
 *  };
 */

/*
 * function encode(query, prefix, ans) {
 *     for(const q in query) {
 *         if(typeof(query[q]) == "object" && !(Array.isArray(query[q]))) {
 *             encode(query[q], prefix+q+'_', ans);
 *         }
 *         else {
 *             ans[prefix+q] = query[q];
 *         }
 *     }
 * }
 */

/*
 * const encodedQuery = {};
 * encode(query, '', encodedQuery);
 * console.log(encodedQuery);
 */

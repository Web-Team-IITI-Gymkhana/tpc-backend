import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class QueryInterceptor implements NestInterceptor {
  constructor() {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const query = req.query;
    const ans = {};

    for (const i in query) {
      const nestedValues = i.split("_");
      let ans1 = ans;
      for (let j = 0; j < nestedValues.length - 1; j++) {
        const k = nestedValues[j];
        if (!ans1[k]) ans1[k] = {};
        ans1 = ans1[k];
      }
      ans1[nestedValues[nestedValues.length - 1]] = query[i];
    }
    req.query = ans;

    return next.handle();
  }
}

// The function assumes that the query params are given like so:
//{'param1': 'value1', 'param2_nestedParam1': 'nestedValue1','param2_nestedParam2': 'nestedValue2'};
// for the required value:
// {
//   param1: 'value1',
//   param2: { nestedParam1: 'nestedValue1', nestedParam2: 'nestedValue2' }
// }

//The encoding function is given below (To be used by frontend):
// const query = {
//   param1: 'value1',
//   param2: { nestedParam1: {value: 'nestedValue1'}, nestedParam2: 'nestedValue2' },
//   param3: [1,2,3]
// };

// function encode(query, prefix, ans) {
//     for(const q in query) {
//         if(typeof(query[q]) == "object" && !(Array.isArray(query[q]))) {
//             encode(query[q], prefix+q+'_', ans);
//         }
//         else {
//             ans[prefix+q] = query[q];
//         }
//     }
// }

// const encodedQuery = {};
// encode(query, '', encodedQuery);
// console.log(encodedQuery);

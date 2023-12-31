import { isArray } from "lodash";
import { Transaction } from "sequelize";

export const isProductionEnv = (): boolean => {
  return process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging";
};

export const queryBuilder = (query: object, entity) => {
  for (const key in query) {
    if (typeof query[key] == "string" || typeof query[key] == "number" || typeof query[key] == "boolean") {
      entity[key] = query[key];
    } else if (typeof query[key] == "object") {
      entity[key] = Object.assign(entity[key], query[key]);
    } else {
      throw Error(`queryBuilder does not support type ${typeof query[key]} at key ${key}`);
    }
  }
  return entity;
};

export function getQueryValues(where) {
  let values = {};
  for (const key in where) {
    if (where[key]) {
      if(typeof where[key] == "object") {
        values[key] = Object.assign(values[key], where[key]);
      } else {
        values[key] = where[key];
      }
    }
  }
  return values;
}

export async function UpdateOrFind(
  id: string,
  fieldsToUpdate: object,
  obj: any,
  funcUpdate: any,
  funcFind: any,
  t?: Transaction
) {
  if (Object.keys(fieldsToUpdate).length) {
    const ans = await obj[funcUpdate](id, fieldsToUpdate, t);
    return ans;
  } else {
    try {
      const ans = await obj[funcFind]({ id: id }, t);
      if (isArray(ans)) {
        return ans[0];
      }
      return ans;
    } catch {
      const ans = await obj[funcFind](id, t);
      if (isArray(ans)) {
        return ans[0];
      }
      return ans;
    }
  }
}

import { isArray, isObject } from "lodash";
import { Op } from "sequelize";
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
      if (isObject(where[key])) {
        values[key] = Object.assign({}, where[key]);
      } else {
        values[key] = where[key];
      }
    }
  }
  return values;
}

export function optionsFactory(from?: number, to?: number) {
  const options = {};
  if(from && to) {
    options['offset'] = from;
    options['limit'] = to-from+1;
  }
  return options;
}

export function conformToModel(object, model) {
  const attributes = model.getAttributes();
  const result = {};
  for(const key in attributes) {
    if(object[key]) {
      if(typeof object[key] === "object")         result[key] = Object.assign({}, object[key]);
      else                                        result[key] = object[key];
    }
  }
  return result;
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

export function makeFilter(where) {
  const res = {};
  for(const key in where) {
    const ans = {};
    if(where[key].gt)     ans[Op.gt] = where[key].gt;
    if(where[key].lt)     ans[Op.lt] = where[key].lt;
    if(where[key].eq)     ans[Op.in] = where[key].eq;
    res[key] = ans;
  }
  return res;
}

export function find_order(orderBy, model) {
  const ans = [];
  for(const key in orderBy)     ans.push(key, orderBy[key]);
  return ans;
}

export async function bulkOperate(objectName, functionName, data) {
  const promises = [];
  for(const value of data)        promises.push(objectName[functionName](value));
  const ans = await Promise.all(promises);
  return ans;
}

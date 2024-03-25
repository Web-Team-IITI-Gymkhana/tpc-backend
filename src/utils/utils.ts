/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators, ParseArrayPipe, ValidationPipe } from "@nestjs/common";
import { ApiExtraModels, ApiQuery, getSchemaPath } from "@nestjs/swagger";
import { isArray, isObject } from "lodash";
import { Op } from "sequelize";
import { Transaction } from "sequelize";

export const isProductionEnv = (): boolean => {
  return process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging";
};

export async function bulkOperate(objectName, functionName, params, t?: Transaction) {
  const promises = [];
  for (const param of params) promises.push(objectName[functionName](...param, t));
  const ans = await Promise.all(promises);

  return ans;
}

export function conformToModel(object, model) {
  const attributes = model.getAttributes();
  const result = {};
  for (const key in attributes) {
    if (object[key]) {
      if (typeof object[key] === "object") result[key] = Object.assign({}, object[key]);
      else result[key] = object[key];
      delete object[key];
    }
  }

  return result;
}

export function pipeTransformArray(object, toType) {
  const pipe = new ParseArrayPipe({
    whitelist: true,
    items: toType,
  });

  return pipe.transform(object, { type: "body" });
}

export function pipeTransform(object, toType) {
  const pipe = new ValidationPipe({
    whitelist: true,
    expectedType: toType,
  });

  return pipe.transform(object, { type: "body" });
}

export function flatten(obj) {
  const res = {};

  function flattenObj(object) {
    for (const key in object) {
      if (typeof object[key] === "object") flattenObj(object[key]);
      else if (res[key] === undefined) res[key] = object[key];
    }
  }

  flattenObj(obj);

  return res;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function ApiFilterQuery(fieldName: string, filterDto: Function) {
  return applyDecorators(
    ApiExtraModels(filterDto),
    ApiQuery({
      required: false,
      name: fieldName,
      style: "deepObject",
      explode: true,
      type: "object",
      schema: {
        $ref: getSchemaPath(filterDto),
      },
    })
  );
}

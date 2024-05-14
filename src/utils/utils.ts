/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators, InternalServerErrorException, ParseArrayPipe, Type, ValidationPipe } from "@nestjs/common";
import { ApiExtraModels, ApiQuery, getSchemaPath } from "@nestjs/swagger";
import { ValidationError } from "class-validator";
import { Transaction } from "sequelize";
import { RemoveNullArrayPipe } from "src/interceptor/RemoveNullArrayPipe";
import { RemoveNullValidationPipe } from "src/interceptor/RemoveNullPipe";

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

function exceptionFactoryPipe(errors: ValidationError[]) {
  const message = ["Return Type Mismatch on: "];

  for (const error of errors) message.push(JSON.stringify(error, null, 2));

  return new InternalServerErrorException({
    message: message,
  });
}

export async function pipeTransformArray(objects, toType) {
  const pipe = new RemoveNullArrayPipe({
    whitelist: true,
    items: toType,
    errorHttpStatusCode: 500,
  });

  const ans = await pipe.transform(objects, { type: "body" });

  return ans;
}

export async function pipeTransform(object, toType) {
  const pipe = new RemoveNullValidationPipe({
    whitelist: true,
    transform: true,
    expectedType: toType,
    errorHttpStatusCode: 500,
  });

  const ans = await pipe.transform(object, { type: "body" });

  return ans;
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

export function createArrayPipe(items: Type<unknown>) {
  return new ParseArrayPipe({ items: items, whitelist: true, forbidNonWhitelisted: true });
}

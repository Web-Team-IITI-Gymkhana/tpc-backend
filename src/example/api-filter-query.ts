import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiQuery, getSchemaPath } from "@nestjs/swagger";

/**
 * Combines Swagger Decorators to create a description for `filters[name]=something`
 *  - has support for swagger
 *  - automatic transformation with nestjs
 */
// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/explicit-module-boundary-types, @typescript-eslint/naming-convention
export function ApiFilterQuery(fieldName: string, filterDto: Function) {
  console.log(getSchemaPath(filterDto));

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

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * This decorator allows accessing the transaction param in the request. To get a valid value
 * for transation, the method should have the decorator
 * @UseInterceptors(TransactionInterceptor)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const TransactionParam = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();

  return req.transaction;
});

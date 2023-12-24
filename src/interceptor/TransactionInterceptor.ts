import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";

/**
 * https://ouassim-benmosbah.medium.com/nestjs-and-sequelize-secure-your-data-with-transactions-ba3cd57f91f4
 */
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(@Inject("SEQUELIZE") private readonly sequelizeInstance: Sequelize) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const transaction: Transaction = await this.sequelizeInstance.transaction();
    req.transaction = transaction;
    return next.handle().pipe(
      tap(async () => {
        await transaction.commit();
      }),
      catchError(async (err) => {
        await transaction.rollback();
        throw err;
      })
    );
  }
}

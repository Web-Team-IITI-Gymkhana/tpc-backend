import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

/**
 * This interceptor automatically creates a sequelize transaction at the start of the
 * request which can be used by all queries inside the method. When the request ends,
 * this interceptor automatically commits the transaction and rolls back if there are any issues.
 * The idea has been borrowed from this link:
 * https://ouassim-benmosbah.medium.com/nestjs-and-sequelize-secure-your-data-with-transactions-ba3cd57f91f4
 */
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(@Inject('SEQUELIZE') private readonly sequelizeInstance: Sequelize) {}

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
      }),
    );
  }
}

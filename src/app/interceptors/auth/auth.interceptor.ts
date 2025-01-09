import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs';
import { throwError } from 'rxjs';
import { AccountsService } from '../../services/accounts/accounts.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const accountsService: AccountsService = inject(AccountsService);
  
  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        return accountsService.refreshAccessToken().pipe(
          switchMap(() => {
            return next(req);
          }),
          catchError(err => {
            accountsService.logoutUser();
            return throwError(err);
          })
        );
      }

      return throwError(error);
    })
  );
};

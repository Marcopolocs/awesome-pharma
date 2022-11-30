import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { ErrorSnackbarService } from './error-snackbar.service';

@Injectable()
export class CommonInterceptorService implements HttpInterceptor {
  constructor(private errorSnackbarService: ErrorSnackbarService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        const errorString =
          'An unknown error occurred. Please try again later!';
        this.errorSnackbarService.showError(errorString);
        return throwError(() => new Error(`An error occurred`));
      })
    );
  }
}

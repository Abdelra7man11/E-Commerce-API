import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        if (error.status === 400) {
          if (error.error?.validationErrors) {
            const messages = error.error.validationErrors.map((v: any) => v.errors.join(', ')).join(' | ');
            toast.error(messages, 'Validation Error');
          } else if (error.error?.message) {
            toast.error(error.error.message, 'Bad Request');
          } else {
            toast.error('Bad Request', '400');
          }
        } else if (error.status === 401) {
          // Do not toast for initial background auth check
          if (!req.url.includes('Authentication')) {
            toast.error(error.error?.message || 'Unauthorized access. Please login.', '401');
          }
        } else if (error.status === 404) {
          // Never forcibly hijack router or redirect user away on 404
          if (!req.url.includes('baskets') && !req.url.includes('Address') && !req.url.includes('Authentication')) {
            toast.error(error.error?.message || 'Requested item or resource was not found.', 'Not Found');
          }
        } else if (error.status === 500) {
          toast.error(error.error?.errorMessage || 'An internal server error occurred', '500 Server Error');
        } else {
          toast.error(error.message || 'Something went wrong', 'Network Error');
        }
      }
      return throwError(() => error);
    })
  );
};

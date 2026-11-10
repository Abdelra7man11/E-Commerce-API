import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { BusyService } from '../services/busy.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  // Skip busy spinner for background polling if any
  if (req.url.includes('emailexists')) {
    return next(req);
  }

  busyService.busy();
  return next(req).pipe(
    finalize(() => {
      busyService.idle();
    })
  );
};

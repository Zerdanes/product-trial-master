import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messages = inject(MessageService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // If token missing or expired, redirect to login immediately
    const token = this.auth.getToken();
    if (!token || this.auth.isTokenExpired(token)) {
      this.auth.logout();
      this.router.navigate(['/login']);
      // continue without auth header (or short-circuit)
      return next.handle(req).pipe(
        catchError(err => {
          return throwError(() => err);
        })
      );
    }

    const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    return next.handle(authReq).pipe(
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            // token invalid/expired — clear and redirect to login
            this.auth.logout();
            this.router.navigate(['/login']);
          } else if (err.status === 403) {
            // forbidden — show a non-intrusive banner and do NOT redirect
            try {
              this.messages.add({ severity: 'error', summary: 'Accès refusé', detail: 'Vous n\'êtes pas autorisé à effectuer cette action.' });
            } catch (e) {
              // swallow if MessageService not available
            }
          }
        }
        return throwError(() => err);
      })
    );
  }
}

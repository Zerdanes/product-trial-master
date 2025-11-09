import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  // Direct backend base URL (no proxy)
  private readonly BASE = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  register(account: { username: string; firstname: string; email: string; password: string }) {
    return this.http.post(`${this.BASE}/api/account`, account);
  }

  login(creds: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.BASE}/api/token`, creds).pipe(
      map((r) => {
        if (r && (r as any).token) {
          localStorage.setItem(this.TOKEN_KEY, (r as any).token);
        }
        return r;
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const t = this.getToken();
    if (!t) return false;
    return !this.isTokenExpired(t);
  }

  getUserEmail(): string | null {
    const t = this.getToken();
    if (!t) return null;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      return payload.sub || payload.email || null;
    } catch {
      return null;
    }
  }

  isTokenExpired(token?: string): boolean {
    const t = token || this.getToken();
    if (!t) return true;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      if (!payload.exp) return true;
      const exp = Number(payload.exp);
      // exp is in seconds since epoch
      return Date.now() / 1000 >= exp;
    } catch {
      return true;
    }
  }
}

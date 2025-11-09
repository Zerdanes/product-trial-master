import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly BASE = environment.apiBase;
  private readonly _items = signal<number[]>([]);
  public readonly items = this._items.asReadonly();

  constructor(private http: HttpClient) {}

  refresh(): Observable<number[]> {
    return this.http.get<number[]>(`${this.BASE}/api/wishlist`).pipe(
      tap(list => this._items.set(list)),
    );
  }

  add(productId: number): Observable<number[]> {
    return this.http.post<number[]>(`${this.BASE}/api/wishlist`, { productId }).pipe(
      tap(list => this._items.set(list)),
    );
  }

  remove(productId: number): Observable<number[]> {
    return this.http.delete<number[]>(`${this.BASE}/api/wishlist/${productId}`).pipe(
      tap(list => this._items.set(list)),
    );
  }
}

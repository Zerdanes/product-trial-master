import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Product } from '../products/data-access/product.model';

export interface CartEntry {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly BASE = 'http://localhost:3000';
  private readonly _count = signal<number>(0);
  public readonly count = this._count.asReadonly();

  constructor(private http: HttpClient) {}

  refresh(): Observable<CartEntry[]> {
    return this.http.get<CartEntry[]>(`${this.BASE}/api/cart`).pipe(
      tap(items => this._count.set(items.reduce((s, i) => s + (i.quantity || 0), 0))),
    );
  }

  get(): Observable<CartEntry[]> {
    return this.http.get<CartEntry[]>(`${this.BASE}/api/cart`);
  }

  add(productId: number, quantity = 1): Observable<CartEntry[]> {
    return this.http.post<CartEntry[]>(`${this.BASE}/api/cart`, { productId, quantity }).pipe(
      tap(items => this._count.set(items.reduce((s, i) => s + (i.quantity || 0), 0)))
    );
  }

  remove(productId: number): Observable<CartEntry[]> {
    return this.http.delete<CartEntry[]>(`${this.BASE}/api/cart/${productId}`).pipe(
      tap(items => this._count.set(items.reduce((s, i) => s + (i.quantity || 0), 0)))
    );
  }
}

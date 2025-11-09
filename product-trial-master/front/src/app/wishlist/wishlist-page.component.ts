import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from './wishlist.service';
import { HttpClient } from '@angular/common/http';
import { Product } from '../products/data-access/product.model';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h2>Ma liste d'envies</h2>
      <div *ngIf="items?.length === 0">Votre liste d'envies est vide.</div>
    <div *ngFor="let p of products" class="border p-2 my-2 flex items-center gap-4">
        <div class="flex-1">
          <div class="font-bold">{{ p.name }}</div>
          <div class="text-sm text-gray-600">{{ p.description }}</div>
          <div class="mt-2">Prix: {{ p.price | number:'1.2-2' }} €</div>
        </div>
        <div class="flex flex-col items-end">
          <div class="mt-2">
            <button (click)="remove(p.id)" class="btn">Retirer</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class WishlistPageComponent {
  items: number[] = [];
  products: Product[] = [];

  private readonly BASE = 'http://localhost:3000';

  constructor(private wishlist: WishlistService, private http: HttpClient) {
    this.load();
  }

  load() {
    this.wishlist.refresh().subscribe(list => {
      this.items = list;
      this.products = [];
      for (const id of list) {
        this.http.get<Product>(`${this.BASE}/api/products/${id}`).subscribe(p => this.products.push(p));
      }
    });
  }

  remove(productId: number) {
    this.wishlist.remove(productId).subscribe(list => this.load());
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './cart.service';
import { Product } from '../products/data-access/product.model';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h2>Votre panier</h2>
      <div *ngIf="items?.length === 0">Votre panier est vide.</div>
    <div *ngFor="let e of items" class="border p-2 my-2 flex items-center gap-4">
        <div class="flex-1">
          <div class="font-bold">{{ e.product.name }}</div>
          <div class="text-sm text-gray-600">{{ e.product.description }}</div>
          <div class="mt-2">Prix: {{ e.product.price | number:'1.2-2' }} €</div>
        </div>
        <div class="flex flex-col items-end">
          <div>Quantité: {{ e.quantity }}</div>
          <div class="mt-2">
            <button (click)="remove(e.product.id)" class="btn">Retirer</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartPageComponent {
  items: { product: Product; quantity: number }[] = [];

  constructor(private cart: CartService) {
    this.load();
  }

  load() {
    this.cart.get().subscribe(list => this.items = list);
  }

  remove(productId: number) {
    this.cart.remove(productId).subscribe(list => this.items = list);
  }
}

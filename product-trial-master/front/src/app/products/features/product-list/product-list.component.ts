import { Component, OnInit, inject, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { CommonModule } from '@angular/common';
import { CartService } from 'app/cart/cart.service';
import { WishlistService } from 'app/wishlist/wishlist.service';
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [CommonModule, DataViewModule, CardModule, ButtonModule, DialogModule, ProductFormComponent, PaginatorModule, InputTextModule],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  public readonly products = this.productsService.products;
  public readonly productsLocal = signal<Product[]>([]);

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);
  public page = 0;
  public size = 6;
  public total = 0;
  public searchTerm = signal<string>('');

  ngOnInit() {
    this.loadPage(0);
    this.cartService.refresh().subscribe({ next:()=>{}, error:()=>{} });
    this.wishlistService.refresh().subscribe({ next:()=>{}, error:()=>{} });
  }

  loadPage(page: number) {
    this.page = page;
    this.productsService.getPaged(this.page, this.size, this.searchTerm()).subscribe({ next: resp => {
      this.productsLocal.set(resp.items || []);
      this.total = resp.total || 0;
    }, error: () => {
      this.productsLocal.set([]);
      this.total = 0;
    }});
  }

  onSearch(q: string) {
    this.searchTerm.set(q || '');
    this.loadPage(0);
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe({ next: () => {
      // after deletion refresh current page
      // if current page becomes out of range, try to reload previous page
      this.loadPage(this.page);
    }, error: () => {
      // ignore for now
    }});
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe({ next: () => {
        // new item likely on first page
        this.loadPage(0);
        this.closeDialog();
      }, error: () => this.closeDialog() });
    } else {
      this.productsService.update(product).subscribe({ next: () => {
        this.loadPage(this.page);
        this.closeDialog();
      }, error: () => this.closeDialog() });
    }
  }

  public addToCart(product: Product) {
    this.cartService.add(product.id, 1).subscribe();
  }

  public toggleWishlist(product: Product) {
    const list = this.wishlistService.items();
    if (list.includes(product.id)) {
      this.wishlistService.remove(product.id).subscribe();
    } else {
      this.wishlistService.add(product.id).subscribe();
    }
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }
}

import { Routes } from "@angular/router";
import { HomeComponent } from "./shared/features/home/home.component";
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';

export const APP_ROUTES: Routes = [
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "products",
    loadChildren: () =>
      import("./products/products.routes").then((m) => m.PRODUCTS_ROUTES)
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart-page.component').then(m => m.CartPageComponent)
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./wishlist/wishlist-page.component').then(m => m.WishlistPageComponent)
  },
  { path: "", redirectTo: "home", pathMatch: "full" },
];

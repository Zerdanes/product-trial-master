import { Component } from "@angular/core";
import { MenuItem } from "primeng/api";
import { PanelMenuModule } from 'primeng/panelmenu';
import { RouterLink } from '@angular/router';

@Component({
  selector: "app-panel-menu",
  standalone: true,
  imports: [PanelMenuModule, RouterLink],
  template: `
    <p-panelMenu [model]="items" styleClass="w-full" />
  `
})
export class PanelMenuComponent {
  public readonly items: MenuItem[] = [
    {
      label: 'Accueil',
      icon: 'pi pi-home',
      routerLink: ['/home']
    },
    {
      label: 'Produits',
      icon: 'pi pi-barcode',
      routerLink: ['/products/list']
    },
    {
      label: 'Panier',
      icon: 'pi pi-shopping-cart',
      routerLink: ['/cart']
    },
    {
      label: 'Wishlist',
      icon: 'pi pi-heart',
      routerLink: ['/wishlist']
    },
    {
      label: "S'enregistrer",
      icon: 'pi pi-user-plus',
      routerLink: ['/register']
    },
    {
      label: 'Se connecter',
      icon: 'pi pi-sign-in',
      routerLink: ['/login']
    }
  ]
}
  
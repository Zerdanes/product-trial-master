import {
  Component,
  inject,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { BadgeModule } from 'primeng/badge';
import { CartService } from './cart/cart.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, BadgeModule, ToastModule],
})
export class AppComponent {
  title = "ALTEN SHOP";
  public readonly cart = inject(CartService);
}

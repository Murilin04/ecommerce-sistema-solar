import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../service/cart/cart.service';
import { Router } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-mini-cart',
  imports: [MatIconModule, MatMenuModule, MatBadgeModule, NgFor, NgIf, CommonModule],
  templateUrl: './mini-cart.component.html',
  styleUrl: './mini-cart.component.scss',
  animations: [
    trigger('cartBadge', [
      state('hidden', style({ transform: 'scale(0)', opacity: 0 })),
      state('visible', style({ transform: 'scale(1)', opacity: 1 })),

      transition('hidden => visible', [
        style({ transform: 'scale(1.4)', opacity: 1 }),
        animate('180ms ease-out'),
      ]),

      transition('visible => hidden', [
        animate('120ms ease-in', style({ transform: 'scale(0)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class MiniCartComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);

  cart = this.cartService.cart;
  itemCount = this.cartService.itemCount;
  isEmpty = this.cartService.isEmpty;

  ngOnInit(): void {
    // Observar mudanças no carrinho
    this.cartService.getCartUpdates().subscribe();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }

  goToCart(): void {
    this.router.navigate(['/carrinho']);
  }

  goToProducts(): void {
    this.router.navigate(['/produtos']);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}

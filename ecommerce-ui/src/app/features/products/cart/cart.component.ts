import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { CommonModule } from '@angular/common';
import { CartService } from '../../service/cart/cart.service';
import { CartItem } from '../../models/CartItem.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [MatIcon, MatFormField, MatLabel, CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit{
    private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Cart data
  cart = this.cartService.cart;
  itemCount = this.cartService.itemCount;
  isEmpty = this.cartService.isEmpty;

  // CEP e Cupom
  cep: string = '';
  cupomCode: string = '';
  calculandoFrete: boolean = false;
  aplicandoCupom: boolean = false;

  // Modal de confirmação
  showDeleteModal: boolean = false;
  itemToDelete: CartItem | null = null;

  isAuthenticated: boolean = false;

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }

  // Incrementar quantidade
  incrementQuantity(itemId: number): void {
    this.cartService.incrementQuantity(itemId);
  }

  // Decrementar quantidade
  decrementQuantity(itemId: number): void {
    this.cartService.decrementQuantity(itemId);
  }

  // Atualizar quantidade manualmente
  updateQuantity(itemId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantidade = parseInt(input.value, 10);

    if (quantidade > 0) {
      this.cartService.updateQuantity(itemId, quantidade);
    } else {
      input.value = '1';
      this.cartService.updateQuantity(itemId, 1);
    }
  }

  // Confirmar remoção
  confirmRemove(item: CartItem): void {
    this.itemToDelete = item;
    this.showDeleteModal = true;
  }

  // Cancelar remoção
  cancelRemove(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  // Remover item
  removeItem(): void {
    if (this.itemToDelete) {
      this.cartService.removeItem(this.itemToDelete.id);
      this.snackBar.open('Item removido do carrinho', 'Fechar', {
        duration: 3000,
        panelClass: ['snackbar-sucesso']
      });
      this.showDeleteModal = false;
      this.itemToDelete = null;
    }
  }

  // Limpar carrinho
  clearCart(): void {
    if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
      this.cartService.clearCart();
      this.snackBar.open('Carrinho limpo com sucesso', 'Fechar', {
        duration: 3000,
        panelClass: ['snackbar-sucesso']
      });
    }
  }

  // Calcular frete
  calcularFrete(): void {
    if (!this.cep || this.cep.length < 8) {
      this.snackBar.open('Digite um CEP válido', 'Fechar', {
        duration: 3000,
        panelClass: ['snackbar-erro']
      });
      return;
    }

    this.calculandoFrete = true;

    this.cartService.calculateShipping(this.cep).subscribe({
      next: (response) => {
        this.snackBar.open(
          `Frete calculado: R$ ${response.valor.toFixed(2)}`,
          'Fechar',
          { duration: 3000, panelClass: ['snackbar-sucesso'] }
        );
        this.calculandoFrete = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao calcular frete', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-erro']
        });
        this.calculandoFrete = false;
      }
    });
  }

  // Aplicar cupom
  aplicarCupom(): void {
    if (!this.cupomCode) {
      this.snackBar.open('Digite um código de cupom', 'Fechar', {
        duration: 3000,
        panelClass: ['snackbar-erro']
      });
      return;
    }

    this.aplicandoCupom = true;

    this.cartService.applyCoupon(this.cupomCode).subscribe({
      next: (response) => {
        this.snackBar.open(
          `Cupom aplicado! Desconto: R$ ${response.desconto.toFixed(2)}`,
          'Fechar',
          { duration: 3000, panelClass: ['snackbar-sucesso'] }
        );
        this.aplicandoCupom = false;
        this.cupomCode = '';
      },
      error: (error) => {
        this.snackBar.open('Cupom inválido ou expirado', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-erro']
        });
        this.aplicandoCupom = false;
      }
    });
  }

  // Continuar comprando
  continueShopping(): void {
    this.router.navigate(['/produtos']);
  }

  // Ir para checkout
  proceedToCheckout(): void {
    if (!this.isAuthenticated) {
      this.snackBar.open('Faça login para finalizar a compra', 'Login', {
        duration: 5000,
        panelClass: ['snackbar-warning']
      }).onAction().subscribe(() => {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: '/checkout' }
        });
      });
      return;
    }

    if (this.isEmpty()) {
      this.snackBar.open('Seu carrinho está vazio', 'Fechar', {
        duration: 3000,
        panelClass: ['snackbar-erro']
      });
      return;
    }

    this.router.navigate(['/checkout']);
  }

  // Formatar preço
  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  // Erro de imagem
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/img/produtos/placeholder.png';
  }
}

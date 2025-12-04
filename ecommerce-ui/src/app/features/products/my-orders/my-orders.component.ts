import { Component, inject, OnInit } from '@angular/core';
import { Order } from '../../models/Order.model';
import { OrderService } from '../../service/order/order.service';
import { AuthService } from '../../../auth/service/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../service/cart/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private cartService = inject(CartService);

  orders: Order[] = [];
  loading = true;
  userId: number | null = null;

  ngOnInit(): void {
    // Obter ID do usuário
    this.userId = this.authService.getUserId();

    if (!this.userId) {
      this.snackBar.open('Faça login para ver seus pedidos', 'OK', { duration: 3000 });
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/meus-pedidos' } });
      return;
    }

    this.loadOrders();
  }

  loadOrders(): void {
    if (!this.userId) return;

    this.loading = true;

    this.orderService.getOrdersByUserId(this.userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
        console.log('📦 Pedidos carregados:', orders);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar pedidos:', error);
        this.snackBar.open('Erro ao carregar pedidos', 'OK', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'PENDING': 'Aguardando Pagamento',
      'PAID': 'Pago',
      'PROCESSING': 'Em Processamento',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregue',
      'CANCELLED': 'Cancelado'
    };
    return labels[status] || status;
  }

  getPaymentMethodLabel(method: string): string {
    const labels: { [key: string]: string } = {
      'PIX': 'PIX',
      'CREDIT_CARD': 'Cartão de Crédito',
      'DEBIT_CARD': 'Cartão de Débito',
      'BOLETO': 'Boleto Bancário'
    };
    return labels[method] || method;
  }

  getPaymentStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'PENDING': 'Aguardando',
      'PROCESSING': 'Processando',
      'PAID': 'Pago',
      'FAILED': 'Falhou',
      'REFUNDED': 'Reembolsado'
    };
    return labels[status] || status;
  }

  viewOrderDetails(order: Order): void {
    this.router.navigate(['/pedido', order.id]);
  }

  cancelOrder(order: Order): void {
    const confirmed = confirm(`Tem certeza que deseja cancelar o pedido #${order.orderNumber}?`);

    if (!confirmed) return;

    const reason = prompt('Por favor, informe o motivo do cancelamento:');

    if (!reason) {
      this.snackBar.open('Cancelamento não realizado', 'OK', { duration: 3000 });
      return;
    }

    this.orderService.cancelOrder(order.id, reason).subscribe({
      next: () => {
        this.snackBar.open('Pedido cancelado com sucesso', 'OK', { duration: 3000 });
        this.loadOrders(); // Recarregar lista
      },
      error: (error) => {
        console.error('❌ Erro ao cancelar pedido:', error);
        this.snackBar.open('Erro ao cancelar pedido', 'OK', { duration: 3000 });
      }
    });
  }

  reorder(order: Order): void {
    const confirmed = confirm('Deseja adicionar os itens deste pedido ao carrinho?');

    if (!confirmed) return;

    // Adicionar cada item ao carrinho
    order.items.forEach(item => {
      const produto = {
        id: item.productId,
        nome: item.productName,
        preco: Math.round(item.unitPrice * 100), // Converter para centavos
        imagem: item.productImage,
        codigoCategoria: item.productCode
      };

      this.cartService.addToCart(produto, item.quantity);
    });

    this.snackBar.open('Itens adicionados ao carrinho!', 'Ver Carrinho', {
      duration: 5000
    }).onAction().subscribe(() => {
      this.router.navigate(['/carrinho']);
    });
  }

  copyTrackingCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.snackBar.open('Código de rastreamento copiado!', 'OK', { duration: 2000 });
    });
  }

  goToProducts(): void {
    this.router.navigate(['/produtos']);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/img/avatar-placeholder.png';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }
}

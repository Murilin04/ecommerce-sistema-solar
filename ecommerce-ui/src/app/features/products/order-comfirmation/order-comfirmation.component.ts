import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { Order } from '../../models/Order.model';
import { Payment } from '../../models/Payment.model';
import { OrderService } from '../../service/order/order.service';
import { PaymentService } from '../../service/payment/payment.service';

@Component({
  selector: 'app-order-comfirmation',
  imports: [CommonModule],
  templateUrl: './order-comfirmation.component.html',
  styleUrl: './order-comfirmation.component.scss'
})
export class OrderConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);

  order: Order | null = null;
  payment: Payment | null = null;
  paymentMethod: string | null = null;
  loading = true;

  ngOnInit(): void {
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    const orderNumber = this.route.snapshot.queryParamMap.get('orderNumber');
    this.paymentMethod = this.route.snapshot.queryParamMap.get('paymentMethod');

    if (orderId) {
      this.loadOrder(parseInt(orderId));
    } else if (orderNumber) {
      this.loadOrderByNumber(orderNumber);
    } else {
      this.router.navigate(['/']);
    }
  }

  loadOrder(id: number): void {
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;

        // Se tiver pagamento, carregar detalhes
        if (order.payment) {
          this.payment = order.payment;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar pedido:', error);
        this.snackBar.open('Erro ao carregar pedido', 'OK', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadOrderByNumber(orderNumber: string): void {
    this.orderService.getOrderByNumber(orderNumber).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;

        if (order.payment) {
          this.payment = order.payment;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar pedido:', error);
        this.loading = false;
      }
    });
  }

  getPaymentMethodLabel(method: string): string {
    const labels: any = {
      'PIX': 'PIX',
      'CREDIT_CARD': 'Cartão de Crédito',
      'DEBIT_CARD': 'Cartão de Débito',
      'BOLETO': 'Boleto Bancário'
    };
    return labels[method] || method;
  }

  copyPixCode(): void {
    if (this.payment?.pixCode) {
      navigator.clipboard.writeText(this.payment.pixCode);
      this.snackBar.open('Código PIX copiado!', 'OK', { duration: 2000 });
    }
  }

  copyBoleto(): void {
    if (this.payment?.boletoBarcode) {
      navigator.clipboard.writeText(this.payment.boletoBarcode);
      this.snackBar.open('Código de barras copiado!', 'OK', { duration: 2000 });
    }
  }

  viewOrderDetails(): void {
    this.router.navigate(['/meus-pedidos', this.order?.id]);
  }

  continueShopping(): void {
    this.router.navigate(['/produtos']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }
}

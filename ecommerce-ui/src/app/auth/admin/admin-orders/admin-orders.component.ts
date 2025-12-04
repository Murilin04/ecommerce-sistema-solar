import { Component, inject, OnInit } from '@angular/core';
import { Order } from '../../../features/models/Order.model';
import { OrderService } from '../../../features/service/order/order.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  allOrders: Order[] = [];
  displayedOrders: Order[] = [];

  searchTerm = '';
  filterStatus: 'all' | string = 'all';

  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  ngOnInit(): void {
    this.loadAllOrders();
  }

  loadAllOrders(): void {
    // Carregar TODOS os pedidos (admin)
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.allOrders = orders;
        this.applyFilters();
        console.log('📦 Todos os pedidos carregados:', orders.length);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar pedidos:', error);
        this.snackBar.open('Erro ao carregar pedidos', 'OK', { duration: 3000 });
      }
    });
  }

  getOrdersByStatus(status: string): Order[] {
    return this.allOrders.filter(o => o.status === status);
  }

  filterByStatus(status: 'all' | string): void {
    this.filterStatus = status;
    this.currentPage = 0;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allOrders];

    // Filtro por status
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(o => o.status === this.filterStatus);
    }

    // Filtro por busca
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(o =>
        o.orderNumber.toLowerCase().includes(term) ||
        o.customerName?.toLowerCase().includes(term) ||
        o.customerEmail?.toLowerCase().includes(term)
      );
    }

    // Paginação
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.displayedOrders = filtered.slice(start, end);
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

  updateOrderStatus(order: Order, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value;

    const confirmed = confirm(`Alterar status do pedido #${order.orderNumber} para "${newStatus}"?`);

    if (!confirmed) {
      select.value = order.status; // Reverter
      return;
    }

    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: () => {
        this.snackBar.open('Status atualizado com sucesso!', 'OK', { duration: 3000 });
        this.loadAllOrders();
      },
      error: (error) => {
        console.error('❌ Erro ao atualizar status:', error);
        this.snackBar.open('Erro ao atualizar status', 'OK', { duration: 3000 });
        select.value = order.status; // Reverter
      }
    });
  }

  viewOrder(order: Order): void {
    this.router.navigate(['/admin/pedido', order.id]);
  }

  addTrackingCode(order: Order): void {
    const code = prompt('Digite o código de rastreamento:');

    if (!code) return;

    this.orderService.addTrackingCode(order.id, code).subscribe({
      next: () => {
        this.snackBar.open('Código de rastreamento adicionado!', 'OK', { duration: 3000 });
        this.loadAllOrders();
      },
      error: (error) => {
        console.error('❌ Erro:', error);
        this.snackBar.open('Erro ao adicionar código', 'OK', { duration: 3000 });
      }
    });
  }

  cancelOrderAdmin(order: Order): void {
    const reason = prompt('Motivo do cancelamento:');

    if (!reason) return;

    this.orderService.cancelOrder(order.id, reason).subscribe({
      next: () => {
        this.snackBar.open('Pedido cancelado!', 'OK', { duration: 3000 });
        this.loadAllOrders();
      },
      error: (error) => {
        console.error('❌ Erro:', error);
        this.snackBar.open('Erro ao cancelar pedido', 'OK', { duration: 3000 });
      }
    });
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;

    let startPage = Math.max(0, this.currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(0, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }
}

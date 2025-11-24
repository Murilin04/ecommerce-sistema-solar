import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../models/Order.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiPath}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(orderData: any): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderData);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getOrderByNumber(orderNumber: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/number/${orderNumber}`);
  }

  getOrdersByUserId(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  cancelOrder(id: number, reason: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/cancel`, null, {
      params: { reason },
    });
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/all`);
  }

  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, { status });
  }

  addTrackingCode(id: number, code: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/tracking`, { code });
  }
}

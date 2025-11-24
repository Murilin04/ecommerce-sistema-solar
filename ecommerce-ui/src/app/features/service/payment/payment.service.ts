import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../../models/Payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiPath}/payments`;

  constructor(private http: HttpClient) {}

  processPayment(paymentData: any): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/process`, paymentData);
  }

  confirmPayment(transactionId: string): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/confirm/${transactionId}`, {});
  }
}


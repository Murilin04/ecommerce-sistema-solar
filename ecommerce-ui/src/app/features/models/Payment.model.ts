export interface Payment {
  id: number;
  transactionId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  cardLastDigits?: string;
  cardBrand?: string;
  pixQrCode?: string;
  pixCode?: string;
  boletoUrl?: string;
  boletoBarcode?: string;
  installments: number;
  installmentAmount?: number;
  paidAt?: string;
  expiresAt?: string;
  createdAt: string;
}

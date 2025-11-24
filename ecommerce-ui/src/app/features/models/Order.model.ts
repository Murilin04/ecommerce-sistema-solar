import { OrderItem } from "./OrderItem.model";

export interface Order {
  payment: any;
  id: number;
  orderNumber: string;
  userId: number;
  total: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: string;
  shippingZipCode: string;
  shippingCity: string;
  shippingState: string;
  shippingComplement?: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  notes?: string;
  trackingCode?: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  items: OrderItem[];
}

import { CartItem } from "./CartItem.model";

export interface Cart {
  id?: number;
  userId?: number;
  items: CartItem[];
  subtotal: number;
  desconto: number;
  frete: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

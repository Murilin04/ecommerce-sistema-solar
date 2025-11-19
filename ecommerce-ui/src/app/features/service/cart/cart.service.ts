import { computed, Injectable, signal } from '@angular/core';
import { Cart } from '../../models/Cart.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../../models/CartItem.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/carrinho';

  // Signals para reatividade
  private cartSignal = signal<Cart>({
    items: [],
    subtotal: 0,
    desconto: 0,
    frete: 0,
    total: 0
  });

  // Computed signals
  cart = this.cartSignal.asReadonly();
  itemCount = computed(() =>
    this.cartSignal().items.reduce((sum, item) => sum + item.quantidade, 0)
  );
  isEmpty = computed(() => this.cartSignal().items.length === 0);

  // Subject para notificações
  private cartUpdated$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  // Carregar carrinho do backend ou localStorage
  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      this.cartSignal.set(cart);
    }
  }

  // Adicionar produto ao carrinho
  addToCart(produto: any, quantidade: number = 1): void {
    const currentCart = this.cartSignal();
    const existingItem = currentCart.items.find(item => item.produtoId === produto.id);

    if (existingItem) {
      existingItem.quantidade += quantidade;
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        produtoId: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: quantidade,
        imagem: produto.imagem,
        categoria: produto.categoria
      };
      currentCart.items.push(newItem);
    }

    this.recalcularTotal();
    this.saveCart();
    this.cartUpdated$.next(true);
  }

  // Remover item do carrinho
  removeItem(itemId: number): void {
    const currentCart = this.cartSignal();
    currentCart.items = currentCart.items.filter(item => item.id !== itemId);

    this.recalcularTotal();
    this.saveCart();
    this.cartUpdated$.next(true);
  }

  // Atualizar quantidade
  updateQuantity(itemId: number, quantidade: number): void {
    if (quantidade < 1) return;

    const currentCart = this.cartSignal();
    const item = currentCart.items.find(i => i.id === itemId);

    if (item) {
      item.quantidade = quantidade;
      this.recalcularTotal();
      this.saveCart();
      this.cartUpdated$.next(true);
    }
  }

  // Incrementar quantidade
  incrementQuantity(itemId: number): void {
    const currentCart = this.cartSignal();
    const item = currentCart.items.find(i => i.id === itemId);
    if (item) {
      item.quantidade++;
      this.recalcularTotal();
      this.saveCart();
    }
  }

  // Decrementar quantidade
  decrementQuantity(itemId: number): void {
    const currentCart = this.cartSignal();
    const item = currentCart.items.find(i => i.id === itemId);
    if (item && item.quantidade > 1) {
      item.quantidade--;
      this.recalcularTotal();
      this.saveCart();
    }
  }

  // Aplicar cupom de desconto
  applyCoupon(couponCode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/aplicar-cupom`, { code: couponCode });
  }

  // Calcular frete
  calculateShipping(cep: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/calcular-frete`, { cep });
  }

  // Recalcular total
  private recalcularTotal(): void {
    const currentCart = this.cartSignal();

    currentCart.subtotal = currentCart.items.reduce(
      (sum, item) => sum + (item.preco * item.quantidade), 0
    );

    currentCart.total = currentCart.subtotal - currentCart.desconto + currentCart.frete;

    this.cartSignal.set({ ...currentCart });
  }

  // Salvar no localStorage
  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartSignal()));
  }

  // Limpar carrinho
  clearCart(): void {
    this.cartSignal.set({
      items: [],
      subtotal: 0,
      desconto: 0,
      frete: 0,
      total: 0
    });
    localStorage.removeItem('cart');
    this.cartUpdated$.next(true);
  }

  // Sincronizar com backend
  syncWithBackend(userId: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/sync`, {
      userId,
      cart: this.cartSignal()
    });
  }

  // Finalizar compra
  checkout(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, {
      ...orderData,
      cart: this.cartSignal()
    });
  }

  // Observable para mudanças no carrinho
  getCartUpdates(): Observable<boolean> {
    return this.cartUpdated$.asObservable();
  }

  // Obter carrinho do backend
  getCartFromBackend(userId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/usuario/${userId}`);
  }

  // Salvar carrinho no backend
  saveCartToBackend(userId: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/salvar`, {
      userId,
      cart: this.cartSignal()
    });
  }
}

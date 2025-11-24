import { computed, Injectable, signal } from '@angular/core';
import { Cart } from '../../models/Cart.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../../models/CartItem.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiPath}/carrinho`;

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

  // ========== NOVOS MÉTODOS PARA CHECKOUT ==========

  /**
   * Obter itens do carrinho no formato compatível com OrderItem
   * @returns Array de itens formatados para o checkout
   */
  getCartItems(): Array<{
    produto: {
      id: number;
      nome: string;
      preco: number;
      imagem: string;
      codigoCategoria: string;
    };
    quantidade: number;
  }> {
    const currentCart = this.cartSignal();

    return currentCart.items.map(item => ({
      produto: {
        id: item.produtoId,
        nome: item.nome,
        preco: item.preco,
        imagem: item.imagem,
        codigoCategoria: item.categoria || ''
      },
      quantidade: item.quantidade
    }));
  }

  /**
   * Obter total do carrinho (em centavos)
   */
  getTotal(): number {
    return this.cartSignal().total;
  }

  /**
   * Obter subtotal do carrinho (em centavos)
   */
  getSubtotal(): number {
    return this.cartSignal().subtotal;
  }

  /**
   * Definir valor do frete (em centavos)
   */
  setShippingCost(cost: number): void {
    const currentCart = this.cartSignal();
    currentCart.frete = cost;
    this.recalcularTotal();
    this.saveCart();
  }

  /**
   * Obter frete atual
   */
  getShippingCost(): number {
    return this.cartSignal().frete;
  }

  /**
   * Definir desconto (em centavos)
   */
  setDiscount(discount: number): void {
    const currentCart = this.cartSignal();
    currentCart.desconto = discount;
    this.recalcularTotal();
    this.saveCart();
  }

  /**
   * Obter desconto atual
   */
  getDiscount(): number {
    return this.cartSignal().desconto;
  }

  /**
   * Obter carrinho no formato para criar pedido
   */
  getCartForOrder(): {
    items: Array<{
      productId: number;
      productName: string;
      productImage: string;
      productCode: string;
      quantity: number;
      unitPrice: number;
    }>;
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
  } {
    const currentCart = this.cartSignal();

    return {
      items: currentCart.items.map(item => ({
        productId: item.produtoId,
        productName: item.nome,
        productImage: item.imagem,
        productCode: item.categoria || '',
        quantity: item.quantidade,
        unitPrice: (item.preco || 0) / 100 // Converter de centavos para reais
      })),
      subtotal: currentCart.subtotal / 100,
      shippingCost: currentCart.frete / 100,
      discount: currentCart.desconto / 100,
      total: currentCart.total / 100
    };
  }

  // ========== FIM DOS NOVOS MÉTODOS ==========

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

  // Finalizar compra (DEPRECATED - usar OrderService)
  checkout(orderData: any): Observable<any> {
    console.warn('⚠️ CartService.checkout() está deprecated. Use OrderService.createOrder()');
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

  /**
   * Validar se o carrinho está pronto para checkout
   */
  isReadyForCheckout(): { ready: boolean; errors: string[] } {
    const errors: string[] = [];
    const currentCart = this.cartSignal();

    if (currentCart.items.length === 0) {
      errors.push('Carrinho vazio');
    }

    currentCart.items.forEach(item => {
      if (!item.produtoId) {
        errors.push(`Item sem ID: ${item.nome}`);
      }
      if (item.quantidade < 1) {
        errors.push(`Quantidade inválida para: ${item.nome}`);
      }
      if (!item.preco || item.preco <= 0) {
        errors.push(`Preço inválido para: ${item.nome}`);
      }
    });

    return {
      ready: errors.length === 0,
      errors
    };
  }

  /**
   * Obter número de itens únicos (não total de quantidade)
   */
  getUniqueItemCount(): number {
    return this.cartSignal().items.length;
  }

  /**
   * Verificar se produto está no carrinho
   */
  isProductInCart(productId: number): boolean {
    return this.cartSignal().items.some(item => item.produtoId === productId);
  }

  /**
   * Obter quantidade de um produto específico no carrinho
   */
  getProductQuantity(productId: number): number {
    const item = this.cartSignal().items.find(i => i.produtoId === productId);
    return item ? item.quantidade : 0;
  }
}

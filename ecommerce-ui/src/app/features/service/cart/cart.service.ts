import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/service/auth.service';
import { Cart } from '../../models/Cart.model';
import { CartItem } from '../../models/CartItem.model';

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

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadCart();
    this.setupAuthListener();
  }

  // Escuta mudanças de autenticação para trocar/limpar carrinho
  private setupAuthListener(): void {
    this.authService.isAuthenticated$.subscribe(() => {
      this.loadCart();
    });

    // Escuta mudanças de role (que indicam troca de usuário)
    this.authService.roleChanged$.subscribe(() => {
      this.loadCart();
    });
  }


  // Gera chave única do localStorage baseada no usuário
  private getCartKey(): string {
    const userId = this.authService.getUserId();

    if (userId) {
      return `cart_user_${userId}`;
    }

    // Carrinho para usuário não autenticado (guest)
    return 'cart_guest';
  }


  // Carregar carrinho do localStorage específico do usuário

  private loadCart(): void {
    const cartKey = this.getCartKey();
    const savedCart = localStorage.getItem(cartKey);

    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        this.cartSignal.set(cart);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        this.clearCart();
      }
    } else {
      // Se não houver carrinho salvo, inicializa vazio
      this.clearCart();
    }
  }

  // Salvar no localStorage específico do usuário
  private saveCart(): void {
    const cartKey = this.getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(this.cartSignal()));
  }


   // Migrar carrinho de guest para usuário autenticado
   // Chamado após login bem-sucedido
  public migrateGuestCartToUser(): void {
    const guestCart = localStorage.getItem('cart_guest');

    if (guestCart && this.authService.getUserId()) {
      try {
        const cart = JSON.parse(guestCart);

        // Se o carrinho guest tem itens
        if (cart.items && cart.items.length > 0) {
          const userCartKey = this.getCartKey();
          const userCart = localStorage.getItem(userCartKey);

          if (userCart) {
            // Mesclar carrinhos
            const existingCart = JSON.parse(userCart);
            cart.items.forEach((guestItem: CartItem) => {
              const existingItem = existingCart.items.find(
                (item: CartItem) => item.produtoId === guestItem.produtoId
              );

              if (existingItem) {
                existingItem.quantidade += guestItem.quantidade;
              } else {
                existingCart.items.push(guestItem);
              }
            });

            this.cartSignal.set(existingCart);
          } else {
            // Usar carrinho guest como carrinho do usuário
            this.cartSignal.set(cart);
          }

          this.recalcularTotal();
          this.saveCart();

          // Limpar carrinho guest
          localStorage.removeItem('cart_guest');
        }
      } catch (error) {
        console.error('Erro ao migrar carrinho:', error);
      }
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

  // ========== MÉTODOS PARA CHECKOUT ==========

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

  getTotal(): number {
    return this.cartSignal().total;
  }

  getSubtotal(): number {
    return this.cartSignal().subtotal;
  }

  setShippingCost(cost: number): void {
    const currentCart = this.cartSignal();
    currentCart.frete = cost;
    this.recalcularTotal();
    this.saveCart();
  }

  getShippingCost(): number {
    return this.cartSignal().frete;
  }

  setDiscount(discount: number): void {
    const currentCart = this.cartSignal();
    currentCart.desconto = discount;
    this.recalcularTotal();
    this.saveCart();
  }

  getDiscount(): number {
    return this.cartSignal().desconto;
  }

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
        unitPrice: (item.preco || 0) / 100
      })),
      subtotal: currentCart.subtotal / 100,
      shippingCost: currentCart.frete / 100,
      discount: currentCart.desconto / 100,
      total: currentCart.total / 100
    };
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

  // Limpar carrinho
  clearCart(): void {
    this.cartSignal.set({
      items: [],
      subtotal: 0,
      desconto: 0,
      frete: 0,
      total: 0
    });
    const cartKey = this.getCartKey();
    localStorage.removeItem(cartKey);
    this.cartUpdated$.next(true);
  }


  //Limpar carrinho ao fazer logout
  //Chamado pelo componente após logout
  public clearCartOnLogout(): void {
    // Remove carrinho do usuário atual
    const cartKey = this.getCartKey();
    localStorage.removeItem(cartKey);

    // Inicializa carrinho guest vazio
    this.clearCart();
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

  getUniqueItemCount(): number {
    return this.cartSignal().items.length;
  }

  isProductInCart(productId: number): boolean {
    return this.cartSignal().items.some(item => item.produtoId === productId);
  }

  getProductQuantity(productId: number): number {
    const item = this.cartSignal().items.find(i => i.produtoId === productId);
    return item ? item.quantidade : 0;
  }
}

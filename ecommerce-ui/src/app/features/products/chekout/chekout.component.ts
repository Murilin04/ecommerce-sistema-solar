import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartItem } from '../../models/CartItem.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../service/cart/cart.service';
import { AuthService } from '../../../auth/service/auth.service';
import { PaymentService } from '../../service/payment/payment.service';
import { OrderService } from '../../service/order/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chekout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chekout.component.html',
  styleUrl: './chekout.component.scss'
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private authService = inject(AuthService);

  currentStep = 1;
  cartItems: CartItem[] = [];
  userId: number | null = null;

  shippingCost = 0; // Em centavos
  discount = 0; // Em centavos

  selectedPaymentMethod: 'PIX' | 'CREDIT_CARD' | 'BOLETO' | null = null;
  processing = false;
  loadingCep = false;

  addressForm: FormGroup;
  cardForm: FormGroup;

  brazilStates = [
    { uf: 'AC', nome: 'Acre' },
    { uf: 'AL', nome: 'Alagoas' },
    { uf: 'AP', nome: 'Amapá' },
    { uf: 'AM', nome: 'Amazonas' },
    { uf: 'BA', nome: 'Bahia' },
    { uf: 'CE', nome: 'Ceará' },
    { uf: 'DF', nome: 'Distrito Federal' },
    { uf: 'ES', nome: 'Espírito Santo' },
    { uf: 'GO', nome: 'Goiás' },
    { uf: 'MA', nome: 'Maranhão' },
    { uf: 'MT', nome: 'Mato Grosso' },
    { uf: 'MS', nome: 'Mato Grosso do Sul' },
    { uf: 'MG', nome: 'Minas Gerais' },
    { uf: 'PA', nome: 'Pará' },
    { uf: 'PB', nome: 'Paraíba' },
    { uf: 'PR', nome: 'Paraná' },
    { uf: 'PE', nome: 'Pernambuco' },
    { uf: 'PI', nome: 'Piauí' },
    { uf: 'RJ', nome: 'Rio de Janeiro' },
    { uf: 'RN', nome: 'Rio Grande do Norte' },
    { uf: 'RS', nome: 'Rio Grande do Sul' },
    { uf: 'RO', nome: 'Rondônia' },
    { uf: 'RR', nome: 'Roraima' },
    { uf: 'SC', nome: 'Santa Catarina' },
    { uf: 'SP', nome: 'São Paulo' },
    { uf: 'SE', nome: 'Sergipe' },
    { uf: 'TO', nome: 'Tocantins' }
  ];

  constructor() {
    this.addressForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
      shippingZipCode: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      shippingAddress: ['', [Validators.required, Validators.minLength(5)]],
      addressNumber: ['', Validators.required],
      shippingComplement: [''],
      shippingCity: ['', Validators.required],
      shippingState: ['', Validators.required]
    });

    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)]],
      cardHolderName: ['', [Validators.required, Validators.minLength(3)]],
      cardExpiry: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cardCvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      installments: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    // Carregar carrinho usando o CartService adaptado
    // substituir $SELECTION_PLACEHOLDER$
    this.cartItems = this.cartService.getCartItems().map(item => ({
      id: item.produto.id,
      produtoId: item.produto.id,
      nome: item.produto.nome,
      preco: item.produto.preco,
      imagem: item.produto.imagem,
      categoria: item.produto.codigoCategoria,
      quantidade: item.quantidade
    }));

    if (this.cartItems.length === 0) {
      this.snackBar.open('Seu carrinho está vazio', 'OK', { duration: 3000 });
      this.router.navigate(['/produtos']);
      return;
    }

    // Obter ID do usuário do AuthService
    this.userId = this.authService.getUserId();

    if (!this.userId) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    // Preencher dados do usuário se disponível
    const payload = this.authService.getTokenPayload();
    if (payload) {
      this.addressForm.patchValue({
        customerName: payload.name || '',
        customerEmail: payload.email || ''
      });
    }

    // Carregar valores do carrinho
    this.shippingCost = this.cartService.getShippingCost();
    this.discount = this.cartService.getDiscount();

    // Calcular frete se ainda não foi calculado
    if (this.shippingCost === 0) {
      this.calculateShipping();
    }
  }

  calculateSubtotal(): number {
    return this.cartService.getSubtotal();
  }

  calculateTotal(): number {
    return this.cartService.getTotal();
  }

  calculateShipping(): void {
    // Simulação: R$ 15,00 de frete fixo
    const freteFixo = 1500; // em centavos
    this.shippingCost = freteFixo;
    this.cartService.setShippingCost(freteFixo);
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      this.currentStep = 2;
    } else if (this.currentStep === 2 && this.addressForm.valid) {
      this.currentStep = 3;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectPaymentMethod(method: 'PIX' | 'CREDIT_CARD' | 'BOLETO'): void {
    this.selectedPaymentMethod = method;
  }

  buscarCep(): void {
    const cep = this.addressForm.get('shippingZipCode')?.value;
    if (!cep || cep.length !== 9) return;

    this.loadingCep = true;
    const cepNumeros = cep.replace('-', '');

    // Buscar CEP via ViaCEP
    fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`)
      .then(res => res.json())
      .then(data => {
        if (!data.erro) {
          this.addressForm.patchValue({
            shippingAddress: data.logradouro,
            shippingCity: data.localidade,
            shippingState: data.uf,
            shippingComplement: data.complemento
          });
        }
      })
      .catch(err => console.error('Erro ao buscar CEP:', err))
      .finally(() => this.loadingCep = false);
  }

  async processPayment(): Promise<void> {
    if (!this.selectedPaymentMethod || !this.userId) {
      this.snackBar.open('Selecione uma forma de pagamento', 'OK', { duration: 3000 });
      return;
    }

    if (this.selectedPaymentMethod === 'CREDIT_CARD' && this.cardForm.invalid) {
      this.snackBar.open('Preencha os dados do cartão corretamente', 'OK', { duration: 3000 });
      return;
    }

    // Validar carrinho
    const validation = this.cartService.isReadyForCheckout();
    if (!validation.ready) {
      this.snackBar.open(
        `Erro no carrinho: ${validation.errors.join(', ')}`,
        'OK',
        { duration: 5000 }
      );
      return;
    }

    this.processing = true;

    try {
      // 1. Preparar dados do pedido usando o CartService
      const addressData = this.addressForm.value;
      const fullAddress = `${addressData.shippingAddress}, ${addressData.addressNumber}`;

      const cartData = this.cartService.getCartForOrder();

      const orderData = {
        userId: this.userId,
        items: cartData.items,
        shippingAddress: fullAddress,
        shippingZipCode: addressData.shippingZipCode,
        shippingCity: addressData.shippingCity,
        shippingState: addressData.shippingState,
        shippingComplement: addressData.shippingComplement,
        customerEmail: addressData.customerEmail,
        customerPhone: addressData.customerPhone,
        customerName: addressData.customerName,
        paymentMethod: this.selectedPaymentMethod,
        shippingCost: cartData.shippingCost,
        discount: cartData.discount
      };

      console.log('📦 Criando pedido:', orderData);

      const order = await this.orderService.createOrder(orderData).toPromise();

      if (!order) {
        throw new Error('Erro ao criar pedido');
      }

      console.log('✅ Pedido criado:', order);

      // 2. Processar pagamento
      const paymentData: any = {
        orderId: order.id,
        paymentMethod: this.selectedPaymentMethod,
        amount: cartData.total
      };

      if (this.selectedPaymentMethod === 'CREDIT_CARD') {
        const cardData = this.cardForm.value;
        paymentData.cardNumber = cardData.cardNumber.replace(/\s/g, '');
        paymentData.cardHolderName = cardData.cardHolderName;
        paymentData.cardExpiryMonth = cardData.cardExpiry.split('/')[0];
        paymentData.cardExpiryYear = '20' + cardData.cardExpiry.split('/')[1];
        paymentData.cardCvv = cardData.cardCvv;
        paymentData.installments = parseInt(cardData.installments);
      }

      console.log('💳 Processando pagamento:', paymentData);

      const payment = await this.paymentService.processPayment(paymentData).toPromise();

      if (!payment) {
        throw new Error('Erro ao processar pagamento');
      }

      console.log('✅ Pagamento processado:', payment);

      // 3. Limpar carrinho
      this.cartService.clearCart();

      // 4. Redirecionar para confirmação
      this.router.navigate(['/checkout/confirmacao'], {
        queryParams: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentMethod: this.selectedPaymentMethod
        }
      });

    } catch (error: any) {
      console.error('❌ Erro ao processar compra:', error);
      this.snackBar.open(
        error.error?.message || 'Erro ao processar compra. Tente novamente.',
        'OK',
        { duration: 5000 }
      );
    } finally {
      this.processing = false;
    }
  }
}

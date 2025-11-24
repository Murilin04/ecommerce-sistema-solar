import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuickViewComponent } from '../quick-view/quick-view.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../service/cart/cart.service';
import { ProductService } from '../../service/product/product.service';
import { Produto } from '../../models/produto.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatIconModule, QuickViewComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  private snackBar = inject(MatSnackBar);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private productService = inject(ProductService);

  private destroy$ = new Subject<void>();

  Math = Math;
  isAuthenticated = false;
  searchTerm: string | null = null;
  categoriaAtual: string | null = null;
  subcategoriaAtual: string | null = null;
  marcaAtual: string | null = null;
  tipoAtual: string | null = null;

  // Modal
  modalAberto = false;
  produtoSelecionado: Produto | null = null;

  // Todos os produtos (agora vêm do backend)
  todosProdutos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  produtosPaginados: Produto[] = [];

  // Paginação
  paginaAtual = 1;
  produtosPorPagina = 12; // 3 linhas de 4 produtos
  totalPaginas = 1;

  // Estado de carregamento
  loading = true;
  error: string | null = null;

  ngOnInit() {
    // Carregar produtos do backend
    this.loadProducts();

    // Verificar autenticação
    this.auth.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuth) => {
        this.isAuthenticated = isAuth;
      });

    // Observar mudanças na rota
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.categoriaAtual = params['categoria'] || null;
        this.subcategoriaAtual = params['subcategoria'] || null;
        this.marcaAtual = params['marca'] || null;
        this.tipoAtual = params['tipo'] || null;
        this.searchTerm = params['q'] || null;

        // Se mudou o termo de busca, resetar para a primeira página
        if (this.searchTerm) {
          this.paginaAtual = 1;
        }

        this.filtrarProdutos();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carrega todos os produtos do backend
   */
  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.todosProdutos = products;
        this.loading = false;
        this.filtrarProdutos();

        // Log para debug
        console.log(`✅ ${products.length} produtos carregados do backend`);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar produtos:', error);
        this.error = 'Não foi possível carregar os produtos.';
        this.loading = false;

        this.snackBar.open(
          'Erro ao carregar produtos. Tente novamente.',
          'Fechar',
          {
            duration: 5000,
            panelClass: ['snackbar-error']
          }
        );
      }
    });
  }

  /**
   * Usa a busca do backend quando há termo de busca
   * Caso contrário, filtra localmente
   */
  filtrarProdutos() {
    // Se houver termo de busca, usar o endpoint de busca do backend
    if (this.searchTerm) {
      this.loading = true;

      this.productService.searchProducts(this.searchTerm).subscribe({
        next: (products) => {
          this.produtosFiltrados = products;
          this.loading = false;
          this.calcularPaginacao();
          this.atualizarProdutosPaginados();

          console.log(`🔍 Busca: "${this.searchTerm}" - ${products.length} resultados`);
        },
        error: (error) => {
          console.error('❌ Erro na busca:', error);
          this.loading = false;
          // Fallback para busca local
          this.filtrarLocalmente();
        }
      });
    }
    // Se houver filtros (categoria, marca, etc), usar o endpoint de filtros
    else if (this.categoriaAtual || this.subcategoriaAtual || this.marcaAtual || this.tipoAtual) {
      this.loading = true;

      this.productService.filterProducts({
        categoria: this.categoriaAtual || undefined,
        subcategoria: this.subcategoriaAtual || undefined,
        marca: this.marcaAtual || undefined,
        tipo: this.tipoAtual || undefined
      }).subscribe({
        next: (products) => {
          this.produtosFiltrados = products;
          this.loading = false;
          this.calcularPaginacao();
          this.atualizarProdutosPaginados();

          console.log(`🔍 Filtros aplicados - ${products.length} resultados`);
        },
        error: (error) => {
          console.error('❌ Erro ao filtrar:', error);
          this.loading = false;
          // Fallback para filtro local
          this.filtrarLocalmente();
        }
      });
    }
    // Caso contrário, mostrar todos
    else {
      this.produtosFiltrados = [...this.todosProdutos];
      this.calcularPaginacao();
      this.atualizarProdutosPaginados();
    }
  }

  /**
   * Fallback: filtro local (caso a API falhe)
   */
  private filtrarLocalmente() {
    // Se houver um termo de busca genérico, filtra por substring em vários campos
    if (this.searchTerm) {
      const q = this.normalizeForCompare(this.searchTerm);
      this.produtosFiltrados = this.todosProdutos.filter((p) => {
        const nome = this.normalizeForCompare(p.nome);
        const descricao = this.normalizeForCompare(p.descricao);
        const categoria = this.normalizeForCompare(p.categoria);
        const marca = this.normalizeForCompare(p.marca);
        const tipo = this.normalizeForCompare(p.tipo);
        const codigo = this.normalizeForCompare(p.codigoCategoria);

        return (
          nome.includes(q) ||
          descricao.includes(q) ||
          categoria.includes(q) ||
          marca.includes(q) ||
          tipo.includes(q) ||
          codigo.includes(q)
        );
      });
    } else {
      // Filtragem dinâmica considerando todos os possíveis filtros
      this.produtosFiltrados = this.todosProdutos.filter((p) => {
        // Comparações flexíveis
        const categoriaOK = this.matchesFilter(p.categoria, this.categoriaAtual);
        const subcategoriaOK = this.matchesFilter(
          p.subcategoria,
          this.subcategoriaAtual
        );
        const marcaOK = this.matchesFilter(p.marca, this.marcaAtual);
        const tipoOK = this.matchesFilter(p.tipo, this.tipoAtual);

        return categoriaOK && subcategoriaOK && marcaOK && tipoOK;
      });
    }

    this.calcularPaginacao();
    this.atualizarProdutosPaginados();
  }

  private normalizeForCompare(value: string | undefined | null): string {
    if (!value) return '';
    return value
      .toString()
      .toLowerCase()
      // normalize + remove diacritics (acentos)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[_\-]+/g, ' ')
      .replace(/[^\w\s]/g, '') // remove pontuação
      .replace(/\s+/g, ' ')
      .trim();
  }

  private matchesFilter(
    productField: string | undefined | null,
    filtro: string | null
  ): boolean {
    if (!filtro) return true; // sem filtro -> aceita
    const prod = this.normalizeForCompare(productField);
    const filt = this.normalizeForCompare(filtro);
    return prod === filt;
  }

  calcularPaginacao() {
    this.totalPaginas = Math.ceil(
      this.produtosFiltrados.length / this.produtosPorPagina
    );
  }

  atualizarProdutosPaginados() {
    const inicio = (this.paginaAtual - 1) * this.produtosPorPagina;
    const fim = inicio + this.produtosPorPagina;
    this.produtosPaginados = this.produtosFiltrados.slice(inicio, fim);
  }

  irParaPagina(pagina: number) {
    this.paginaAtual = pagina;
    this.atualizarProdutosPaginados();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.irParaPagina(this.paginaAtual - 1);
    }
  }

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas) {
      this.irParaPagina(this.paginaAtual + 1);
    }
  }

  consultarPreco(produto: Produto) {
    if (!this.isAuthenticated) {
      this.snackBar
        .open('Faça login para adicionar ao carrinho', 'Login', {
          duration: 5000,
          panelClass: ['snackbar-warning'],
        })
        .onAction()
        .subscribe(() => {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: '/produtos' },
          });
        });
      return;
    }

    // Adicionar ao carrinho
    this.cartService.addToCart(produto, 1);

    this.snackBar
      .open('Produto adicionado ao carrinho!', 'Ver Carrinho', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-sucesso'],
      })
      .onAction()
      .subscribe(() => {
        this.router.navigate(['/carrinho']);
      });
  }

  addToCartWithQuantity(produto: Produto, quantidade: number = 1) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(produto, quantidade);

    this.snackBar
      .open(
        `${quantidade} ${
          quantidade > 1 ? 'produtos adicionados' : 'produto adicionado'
        } ao carrinho!`,
        'Ver Carrinho',
        {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-sucesso'],
        }
      )
      .onAction()
      .subscribe(() => {
        this.router.navigate(['/carrinho']);
      });
  }

  openQuickView(produto: Produto) {
    this.produtoSelecionado = produto;
    this.modalAberto = true;
    document.body.style.overflow = 'hidden';
  }

  closeQuickView() {
    this.modalAberto = false;
    this.produtoSelecionado = null;
    document.body.style.overflow = 'auto';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) {
      img.src = 'assets/img/avatar-placeholder.png';
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}

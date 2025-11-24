import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../auth/service/auth.service';
import { Produto } from '../../models/produto.model';
import { QuickViewComponent } from '../quick-view/quick-view.component';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../service/cart/cart.service';
import { SearchService } from '../../../shared/service/search.service';
import { ProductService } from '../../service/product/product.service';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, MatIconModule, QuickViewComponent, MatSnackBarModule],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss',
})
export class FeaturedProductsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private productService = inject(ProductService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private cartService = inject(CartService);
  private searchService = inject(SearchService);

  showQuickView = false;

  // Array de produtos em destaque carregado do backend
  produtosDestaque: Produto[] = [];

  // Produtos visíveis no carrossel
  produtosVisiveis: Produto[] = [];

  // quando há filtro de busca, armazenamos a versão filtrada
  produtosDestaqueFiltrados: Produto[] | null = null;

  // Controle do carrossel
  indiceAtual = 0;
  produtosPorPagina = 4; // Quantidade de produtos visíveis por vez

  // Controle do modal
  modalAberto = false;
  produtoSelecionado: Produto | null = null;
  isAuthenticated = false;

  // Estado de carregamento
  loading = true;
  error: string | null = null;

  ngOnInit() {
    // Carregar produtos em destaque do backend
    this.loadFeaturedProducts();

    this.ajustarProdutosPorPagina();

    this.auth.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });

    // Escuta o termo de busca global e aplica filtro nos produtos em destaque
    this.searchService.search$.subscribe((term) => {
      if (term) {
        const q = this.normalizeForCompare(term);
        this.produtosDestaqueFiltrados = this.produtosDestaque.filter((p) => {
          const nome = this.normalizeForCompare(p.nome);
          const descricao = this.normalizeForCompare(p.descricao);
          const categoria = this.normalizeForCompare(p.categoria);
          const codigo = this.normalizeForCompare(p.codigoCategoria);

          return (
            nome.includes(q) ||
            descricao.includes(q) ||
            categoria.includes(q) ||
            codigo.includes(q)
          );
        });
      } else {
        this.produtosDestaqueFiltrados = null;
      }

      // reajustar view
      this.indiceAtual = 0;
      this.atualizarProdutosVisiveis();
    });
  }

  /**
   * Carrega produtos em destaque do backend
   */
  loadFeaturedProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getFeaturedProducts().subscribe({
      next: (products) => {
        this.produtosDestaque = products;
        this.loading = false;
        this.atualizarProdutosVisiveis();

        // Log para debug
        console.log(`✅ ${products.length} produtos em destaque carregados`);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar produtos em destaque:', error);
        this.error = 'Não foi possível carregar os produtos em destaque.';
        this.loading = false;

        this.snackBar.open(
          'Erro ao carregar produtos em destaque',
          'Fechar',
          {
            duration: 5000,
            panelClass: ['snackbar-error']
          }
        );
      }
    });
  }

  atualizarProdutosVisiveis() {
    const source = this.produtosDestaqueFiltrados || this.produtosDestaque;
    const inicio = this.indiceAtual;
    const fim = inicio + this.produtosPorPagina;
    this.produtosVisiveis = source.slice(inicio, fim);
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
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  proximosProdutos() {
    const source = this.produtosDestaqueFiltrados || this.produtosDestaque;
    const totalProdutos = source.length;
    const proximoIndice = this.indiceAtual + this.produtosPorPagina;

    if (proximoIndice < totalProdutos) {
      this.indiceAtual = proximoIndice;
      this.atualizarProdutosVisiveis();
    }
  }

  produtosAnteriores() {
    const indiceAnterior = this.indiceAtual - this.produtosPorPagina;

    if (indiceAnterior >= 0) {
      this.indiceAtual = indiceAnterior;
      this.atualizarProdutosVisiveis();
    }
  }

  podeAvancar(): boolean {
    const source = this.produtosDestaqueFiltrados || this.produtosDestaque;
    return this.indiceAtual + this.produtosPorPagina < source.length;
  }

  podeVoltar(): boolean {
    return this.indiceAtual > 0;
  }

  consultarPreco(produto: Produto) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
    } else {
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
  }

  addToCartQuick(produto: Produto, event: Event) {
    event.stopPropagation();

    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(produto, 1);

    this.snackBar.open('✓ Produto adicionado!', 'Fechar', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-success-compact'],
    });
  }

  ajustarProdutosPorPagina() {
    const largura = window.innerWidth;

    if (largura < 576) {
      this.produtosPorPagina = 1;
    } else if (largura < 768) {
      this.produtosPorPagina = 2;
    } else if (largura < 992) {
      this.produtosPorPagina = 3;
    } else {
      this.produtosPorPagina = 4;
    }

    // Reajusta os produtos visíveis
    this.indiceAtual = 0;
    this.atualizarProdutosVisiveis();
  }

  // Handler seguro para erro de carregamento de imagem
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) {
      img.src = 'assets/img/avatar-placeholder.png';
    }
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
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../auth/service/auth.service';
import { Produto } from '../../models/produto.model';
import { QuickViewComponent } from '../quick-view/quick-view.component';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, MatIconModule, QuickViewComponent, MatSnackBarModule],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss'
})
export class FeaturedProductsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  showQuickView = false;
  // Array de produtos em destaque
  produtosDestaque: Produto[] = [
    {
      id: 1,
      nome: 'FRONT BOX AC DE 32A PARA INVERSORES DE ATÉ 6KW MONO',
      descricao: 'Front Box AC de 32A para Inversores de até 6kW Monofásico',
      categoria: 'Componentes CA Quadro CA',
      codigoCategoria: 'Código: 30521',
      imagem: 'assets/img/produtos/front-box-32a.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: true,
      preco: 15000
    },
    {
      id: 2,
      nome: 'DISJUNTOR WEG BIPOLAR 20A, CURVA C, 3kA (380V), DIN',
      descricao: 'Disjuntor Bipolar 20A Curva C 3kA DIN WEG',
      categoria: 'Componentes CA',
      codigoCategoria: 'Código: 31073',
      imagem: 'assets/img/produtos/disjuntor-weg-20a.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: true,
      preco: 2000
    },
    {
      id: 3,
      nome: 'LP16-48100 5.12KWH 51.2V 100A 6.000 CICLOS',
      descricao: 'Bateria de Lítio MUST Solar 5.12kWh 51.2V 100A',
      categoria: 'Bateria de Lítio Must Solar',
      codigoCategoria: 'Código: 41165',
      imagem: 'assets/img/produtos/bateria-litio-must.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: true,
      preco: 20000
    },
    {
      id: 4,
      nome: 'NEO2000M-X 2KW 4MPPT MONOFÁSICO 220V',
      descricao: 'Microinversor Solar Growatt 2kW 4MPPT 220V',
      categoria: 'Inversor Solar Microinversor Solar Growatt',
      codigoCategoria: 'Código: 112096',
      imagem: 'assets/img/produtos/microinversor-growatt.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: true,
      preco: 10000
    },
    {
      id: 5,
      nome: 'GRID ZERO MULTIMARCAS SOLARVIEW MONO BIF. TRIF. COM 3 TCs',
      descricao: 'GRID ZERO MULTIMARCAS SOLARVIEW MONO BIF. TRIF. COM 3 TCs',
      categoria: 'Grid Zero Multimarcas',
      codigoCategoria: 'Código: 20145',
      imagem: 'assets/img/produtos/grid-zero-multimarcas.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: true,
      preco: 5000
    },
  ];

  // Produtos visíveis no carrossel
  produtosVisiveis: Produto[] = [];

  // Controle do carrossel
  indiceAtual = 0;
  produtosPorPagina = 4; // Quantidade de produtos visíveis por vez

  // Controle do modal
  modalAberto = false;
  produtoSelecionado: Produto | null = null;
  isAuthenticated = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.atualizarProdutosVisiveis();
    this.ajustarProdutosPorPagina();

    this.auth.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }

  atualizarProdutosVisiveis() {
    const inicio = this.indiceAtual;
    const fim = inicio + this.produtosPorPagina;
    this.produtosVisiveis = this.produtosDestaque.slice(inicio, fim);
  }

  proximosProdutos() {
    const totalProdutos = this.produtosDestaque.length;
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
    return this.indiceAtual + this.produtosPorPagina < this.produtosDestaque.length;
  }

  podeVoltar(): boolean {
    return this.indiceAtual > 0;
  }

  consultarPreco(produto: Produto) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
    } else {
      this.snackBar.open('Produto adicionado ao carrinho!', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-sucesso']
      });
    }
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
      img.src = 'assets/img/produtos/placeholder.png';
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

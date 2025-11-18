import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuickViewComponent } from '../quick-view/quick-view.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  subcategoria: string,
  marca: string,
  tipo: string,
  codigoCategoria: string;
  imagem: string;
  imagensAdicionais?: string[];
  preco?: number;
  disponibilidade?: string;
  avaliacoes?: number;
  emDestaque: boolean;
}


@Component({
  selector: 'app-products',
  imports: [CommonModule, MatIconModule, QuickViewComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit{
  private snackBar = inject(MatSnackBar);
  Math = Math;
  isAuthenticated = false;
  categoriaAtual: string | null = null;
  subcategoriaAtual: string | null = null;
  marcaAtual: string | null = null;
  tipoAtual: string | null = null;

  // Modal
  modalAberto = false;
  produtoSelecionado: Produto | null = null;

  // Todos os produtos organizados por categoria
  todosProdutos: Produto[] = [
    // ON GRID - Sungrow
    {
      id: 1,
      nome: 'GERADOR ON GRID SUNGROW - LAJE INCLINAÇÃO 5.5KW',
      descricao: 'Kit completo para geração de energia solar em laje com inclinação',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'On Grid',
      marca: 'Sungrow',
      tipo: 'Laje Inclinação',
      codigoCategoria: 'Código: 10001',
      imagem: 'assets/img/produtos/sungrow-laje-inclinacao.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 8500.00
    },
    {
      id: 2,
      nome: 'GERADOR ON GRID SUNGROW - SEM ESTRUTURA 8KW',
      descricao: 'Kit gerador sem estrutura para instalação personalizada',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'On Grid',
      marca: 'Sungrow',
      tipo: 'Sem Estrutura',
      codigoCategoria: 'Código: 10002',
      imagem: 'assets/img/produtos/sungrow-sem-estrutura.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 12000.00
    },
    {
      id: 3,
      nome: 'GERADOR ON GRID SUNGROW - SOLO MESA 8 PAINÉIS 10KW',
      descricao: 'Sistema completo para instalação no solo com mesa para 8 painéis',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'On Grid',
      marca: 'Sungrow',
      tipo: 'Solo Mesa 8 Painéis',
      codigoCategoria: 'Código: 10003',
      imagem: 'assets/img/produtos/sungrow-solo-mesa.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 15000.00
    },
    {
      id: 4,
      nome: 'GERADOR ON GRID SUNGROW - TELHADO CERÂMICO 12KW',
      descricao: 'Kit completo para telhado cerâmico com ganchos',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'On Grid',
      marca: 'Sungrow',
      tipo: 'Telhado Cerâmico',
      codigoCategoria: 'Código: 10004',
      imagem: 'assets/img/produtos/sungrow-telhado-ceramico.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 18000.00
    },

    // ON GRID - SAJ
    {
      id: 5,
      nome: 'GERADOR ON GRID SAJ - LAJE INCLINAÇÃO 6KW',
      descricao: 'Kit SAJ para laje com inclinação',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'On Grid',
      marca: 'SAJ',
      tipo: 'Laje Inclinação',
      codigoCategoria: 'Código: 10005',
      imagem: 'assets/img/produtos/saj-laje-inclinacao.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 9000.00
    },

    // ON GRID - Solplanet
    {
      id: 6,
      nome: 'GERADOR ON GRID SOLPLANET - TELHADO METÁLICO 7KW',
      descricao: 'Sistema Solplanet para telhado metálico com mini trilho',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'On Grid',
      marca: 'Solplanet',
      tipo: 'Telhado Metálico Mini Trilho',
      codigoCategoria: 'Código: 10006',
      imagem: 'assets/img/produtos/solplanet-telhado-metalico.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 11000.00
    },

    // ON GRID - Growatt
    {
      id: 7,
      nome: 'GERADOR ON GRID GROWATT - TELHADO FIBRO 9KW',
      descricao: 'Kit Growatt para telhado de fibrocimento',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'On Grid',
      marca: 'Growatt',
      tipo: 'Telhado Fibro Parafuso Madeira',
      codigoCategoria: 'Código: 10007',
      imagem: 'assets/img/produtos/growatt-telhado-fibro.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 13500.00
    },

    // OFF GRID INTERATIVO - Must
    {
      id: 8,
      nome: 'GERADOR OFF GRID MUST - LAJE INCLINAÇÃO 5KW',
      descricao: 'Sistema off grid interativo Must para laje',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'Off Grid Interativo',
      marca: 'Must',
      tipo: 'Laje Inclinação',
      codigoCategoria: 'Código: 20001',
      imagem: 'assets/img/produtos/must-off-grid-laje.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 16000.00
    },
    {
      id: 9,
      nome: 'GERADOR OFF GRID MUST - TELHADO CERÂMICO 6KW',
      descricao: 'Sistema off grid Must para telhado cerâmico',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'Off Grid Interativo',
      marca: 'Must',
      tipo: 'Telhado Cerâmico',
      codigoCategoria: 'Código: 20002',
      imagem: 'assets/img/produtos/must-off-grid-ceramico.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 17500.00
    },

    // OFF GRID - Luxpower
    {
      id: 10,
      nome: 'GERADOR OFF GRID LUXPOWER - SOLO MESA 8KW',
      descricao: 'Sistema Luxpower off grid para instalação no solo',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'Off Grid Interativo',
      marca: 'Luxpower',
      tipo: 'Solo Mesa 8 Painéis',
      codigoCategoria: 'Código: 20003',
      imagem: 'assets/img/produtos/luxpower-off-grid-solo.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 19000.00
    },

    // HÍBRIDO - Luxpower
    {
      id: 11,
      nome: 'GERADOR HÍBRIDO LUXPOWER - LAJE INCLINAÇÃO 10KW',
      descricao: 'Sistema híbrido Luxpower para máxima eficiência',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'Hibrido',
      marca: 'Luxpower',
      tipo: 'Laje Inclinação',
      codigoCategoria: 'Código: 30001',
      imagem: 'assets/img/produtos/luxpower-hibrido-laje.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 22000.00
    },
    {
      id: 12,
      nome: 'GERADOR HÍBRIDO LUXPOWER - TELHADO ONDULADO 12KW',
      descricao: 'Sistema híbrido para telhado ondulado',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'Hibrido',
      marca: 'Luxpower',
      tipo: 'Telhado Ondulado',
      codigoCategoria: 'Código: 30002',
      imagem: 'assets/img/produtos/luxpower-hibrido-ondulado.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 24000.00
    },

    // RETROFIT - Must
    {
      id: 13,
      nome: 'RETROFIT MUST - SEM ESTRUTURA 5KW',
      descricao: 'Kit retrofit Must para upgrade de sistema existente',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'Retrofit',
      marca: 'Must',
      tipo: 'Sem Estrutura',
      codigoCategoria: 'Código: 40001',
      imagem: 'assets/img/produtos/must-retrofit.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 14000.00
    },

    // RETROFIT - Luxpower
    {
      id: 14,
      nome: 'RETROFIT LUXPOWER - SEM ESTRUTURA 8KW',
      descricao: 'Kit retrofit Luxpower para expansão de sistema',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'Retrofit',
      marca: 'Luxpower',
      tipo: 'Sem Estrutura',
      codigoCategoria: 'Código: 40002',
      imagem: 'assets/img/produtos/luxpower-retrofit.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 16500.00
    },

    // MICROINVERSOR - Growatt
    {
      id: 15,
      nome: 'MICROINVERSOR GROWATT - LAJE INCLINAÇÃO 3KW',
      descricao: 'Sistema com microinversor Growatt para laje',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'Microinversor',
      marca: 'Growatt',
      tipo: 'Laje Inclinação',
      codigoCategoria: 'Código: 50001',
      imagem: 'assets/img/produtos/growatt-micro-laje.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 10500.00
    },
    {
      id: 16,
      nome: 'MICROINVERSOR GROWATT - TELHADO CERÂMICO 4KW',
      descricao: 'Sistema microinversor para telhado cerâmico',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'Microinversor',
      marca: 'Growatt',
      tipo: 'Telhado Cerâmico Gancho',
      codigoCategoria: 'Código: 50002',
      imagem: 'assets/img/produtos/growatt-micro-ceramico.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 12000.00
    },

    // MICROINVERSOR - DEYE
    {
      id: 17,
      nome: 'MICROINVERSOR DEYE - SEM ESTRUTURA 3.5KW',
      descricao: 'Kit microinversor DEYE sem estrutura',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'Microinversor',
      marca: 'DEYE',
      tipo: 'Sem Estrutura',
      codigoCategoria: 'Código: 50003',
      imagem: 'assets/img/produtos/deye-micro-sem-estrutura.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 11000.00
    },
    {
      id: 18,
      nome: 'MICROINVERSOR DEYE - TELHADO METÁLICO 5KW',
      descricao: 'Sistema DEYE para telhado metálico com mini trilho',
      categoria: 'Gerador de Energia Solar',
      subcategoria: 'Microinversor',
      marca: 'DEYE',
      tipo: 'Telhado Metálico MiniTrilho',
      codigoCategoria: 'Código: 50004',
      imagem: 'assets/img/produtos/deye-micro-metalico.png',
      disponibilidade: 'Disponível',
      avaliacoes: 0,
      emDestaque: false,
      preco: 13500.00
    }
  ];

  produtosFiltrados: Produto[] = [];
  produtosPaginados: Produto[] = [];

  // Paginação
  paginaAtual = 1;
  produtosPorPagina = 12; // 3 linhas de 4 produtos
  totalPaginas = 1;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Verificar autenticação
    this.auth.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

    // Observar mudanças na rota
    this.route.queryParams.subscribe((params) => {
      this.categoriaAtual = params['categoria'] || null;
      this.subcategoriaAtual = params['subcategoria'] || null;
      this.marcaAtual = params['marca'] || null;
      this.tipoAtual = params['tipo'] || null;

      this.filtrarProdutos();
    });
  }

  private normalizeForCompare(value: string | undefined | null): string {
    if (!value) return '';
    return value
      .toString()
      .toLowerCase()
      .replace(/[_\-]+/g, ' ')
      .replace(/[^\w\s]/g, '') // remove pontuação
      .replace(/\s+/g, ' ')
      .trim();
  }

  private matchesFilter(productField: string | undefined | null, filtro: string | null): boolean {
    if (!filtro) return true; // sem filtro -> aceita
    const prod = this.normalizeForCompare(productField);
    const filt = this.normalizeForCompare(filtro);
    return prod === filt;
  }

  filtrarProdutos() {
    // Filtragem dinâmica considerando todos os possíveis filtros
    this.produtosFiltrados = this.todosProdutos.filter(p => {
      // Comparações flexíveis
      const categoriaOK = this.matchesFilter(p.categoria, this.categoriaAtual);
      const subcategoriaOK = this.matchesFilter(p.subcategoria, this.subcategoriaAtual);
      const marcaOK = this.matchesFilter(p.marca, this.marcaAtual);
      const tipoOK = this.matchesFilter(p.tipo, this.tipoAtual);

      return categoriaOK && subcategoriaOK && marcaOK && tipoOK;
    });

    this.calcularPaginacao();
    this.atualizarProdutosPaginados();
  }

  calcularPaginacao() {
    this.totalPaginas = Math.ceil(this.produtosFiltrados.length / this.produtosPorPagina);
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
      img.src = 'assets/img/produtos/placeholder.png';
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}

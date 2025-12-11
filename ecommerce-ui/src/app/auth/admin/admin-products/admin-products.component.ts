import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Produto } from '../../../features/models/produto.model';
import { ProductService } from '../../../features/service/product/product.service';


@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatSnackBarModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);

  // Stats
  totalProducts = 0;
  activeProducts = 0;
  lowStockProducts = 0;
  featuredProducts = 0;

  // Products
  allProducts: Produto[] = [];
  displayedProducts: Produto[] = [];

  // Filters
  searchTerm = '';
  filterStatus: 'all' | 'active' | 'featured' | 'lowStock' = 'all';

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  // Modal
  showModal = false;
  showStockModal = false;
  isEditMode = false;
  saving = false;
  selectedProduct: Produto | null = null;
  newStockQuantity: number | null = null;

  // Form
  productForm: FormGroup;

  constructor() {
    this.productForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(255)]],
      descricao: ['', Validators.required],
      categoria: ['', [Validators.required, Validators.maxLength(100)]],
      subcategoria: ['', Validators.maxLength(100)],
      marca: ['', Validators.maxLength(100)],
      tipo: ['', Validators.maxLength(100)],
      codigoCategoria: ['', [Validators.required, Validators.maxLength(50)]],
      preco: [null, [Validators.required, Validators.min(0)]],
      estoque: [0, [Validators.required, Validators.min(0)]],
      imagem: ['', Validators.required],
      imagensAdicionais: [[]],
      emDestaque: [false],
      ativo: [true],
      avaliacoes: [0]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.updateStats();
        this.applyFilters();
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.snackBar.open('Erro ao carregar produtos', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  updateStats(): void {
    this.totalProducts = this.allProducts.length;
    this.activeProducts = this.allProducts.filter(p => p.ativo).length;
    this.lowStockProducts = this.allProducts.filter(p => p.estoque !== undefined && p.estoque <= 10).length;
    this.featuredProducts = this.allProducts.filter(p => p.emDestaque).length;
  }

  onSearch(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  filterByStatus(status: 'all' | 'active' | 'featured' | 'lowStock'): void {
    this.filterStatus = status;
    this.currentPage = 0;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allProducts];

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.nome.toLowerCase().includes(term) ||
        p.descricao?.toLowerCase().includes(term) ||
        p.categoria.toLowerCase().includes(term) ||
        p.marca?.toLowerCase().includes(term) ||
        p.codigoCategoria.toLowerCase().includes(term)
      );
    }

    // Filter by status
    switch (this.filterStatus) {
      case 'active':
        filtered = filtered.filter(p => p.ativo);
        break;
      case 'featured':
        filtered = filtered.filter(p => p.emDestaque);
        break;
      case 'lowStock':
        filtered = filtered.filter(p => p.estoque !== undefined && p.estoque <= 10);
        break;
    }

    // Pagination
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.displayedProducts = filtered.slice(start, end);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;

    let startPage = Math.max(0, this.currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(0, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedProduct = null;
    this.productForm.reset({
      emDestaque: false,
      ativo: true,
      avaliacoes: 0,
      estoque: 0,
      imagensAdicionais: []
    });
    this.showModal = true;
  }

  openEditModal(product: Produto): void {
    this.isEditMode = true;
    this.selectedProduct = product;
    this.productForm.patchValue({
      nome: product.nome,
      descricao: product.descricao,
      categoria: product.categoria,
      subcategoria: product.subcategoria || '',
      marca: product.marca || '',
      tipo: product.tipo || '',
      codigoCategoria: product.codigoCategoria,
      preco: product.preco,
      estoque: product.estoque || 0,
      imagem: product.imagem,
      imagensAdicionais: product.imagensAdicionais || [],
      emDestaque: product.emDestaque,
      ativo: product.ativo ?? true,
      avaliacoes: product.avaliacoes || 0
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.productForm.reset();
    this.selectedProduct = null;
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.snackBar.open('Preencha todos os campos obrigatórios', 'Fechar', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
      return;
    }

    this.saving = true;
    const productData = this.productForm.value;

    const request = this.isEditMode && this.selectedProduct
      ? this.productService.updateProduct(this.selectedProduct.id, productData)
      : this.productService.createProduct(productData);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          `Produto ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso!`,
          'Fechar',
          { duration: 3000, panelClass: ['snackbar-success'] }
        );
        this.closeModal();
        this.loadProducts();
      },
      error: (error) => {
        console.error('Erro ao salvar produto:', error);
        this.snackBar.open(
          error.error?.message || 'Erro ao salvar produto',
          'Fechar',
          { duration: 3000, panelClass: ['snackbar-error'] }
        );
      },
      complete: () => {
        this.saving = false;
      }
    });
  }

  deleteProduct(product: Produto): void {
    if (!confirm(`Deseja realmente desativar o produto "${product.nome}"?`)) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.snackBar.open('Produto desativado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.loadProducts();
      },
      error: (error) => {
        console.error('Erro ao desativar produto:', error);
        this.snackBar.open('Erro ao desativar produto', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  restoreProduct(product: Produto): void {
    this.productService.restoreProduct(product.id).subscribe({
      next: () => {
        this.snackBar.open('Produto restaurado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.loadProducts();
      },
      error: (error) => {
        console.error('Erro ao restaurar produto:', error);
        this.snackBar.open('Erro ao restaurar produto', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  openStockModal(product: Produto): void {
    this.selectedProduct = product;
    this.newStockQuantity = product.estoque || 0;
    this.showStockModal = true;
  }

  closeStockModal(): void {
    this.showStockModal = false;
    this.selectedProduct = null;
    this.newStockQuantity = null;
  }

  updateStock(): void {
    if (!this.selectedProduct || this.newStockQuantity === null) return;

    this.productService.updateStock(this.selectedProduct.id, this.newStockQuantity).subscribe({
      next: () => {
        this.snackBar.open('Estoque atualizado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.closeStockModal();
        this.loadProducts();
      },
      error: (error) => {
        console.error('Erro ao atualizar estoque:', error);
        this.snackBar.open('Erro ao atualizar estoque', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/img/avatar-placeholder.png';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }
}

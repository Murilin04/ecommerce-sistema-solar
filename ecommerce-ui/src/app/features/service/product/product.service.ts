import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Produto } from '../../models/produto.model';

export interface PaginatedResponse {
  products: Produto[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiPath}/products`;

  constructor(private http: HttpClient) {}

  // ========== MÉTODOS PÚBLICOS ==========

  getAllProducts(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  getFeaturedProducts(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/featured`);
  }

  getProductsByCategory(categoria: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/category/${categoria}`);
  }

  getProductsByBrand(marca: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/brand/${marca}`);
  }

  filterProducts(filters: {
    categoria?: string;
    subcategoria?: string;
    marca?: string;
    tipo?: string;
  }): Observable<Produto[]> {
    let params = new HttpParams();

    if (filters.categoria) params = params.set('categoria', filters.categoria);
    if (filters.subcategoria) params = params.set('subcategoria', filters.subcategoria);
    if (filters.marca) params = params.set('marca', filters.marca);
    if (filters.tipo) params = params.set('tipo', filters.tipo);

    return this.http.get<Produto[]>(`${this.apiUrl}/filter`, { params });
  }

  searchProducts(query: string): Observable<Produto[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Produto[]>(`${this.apiUrl}/search`, { params });
  }

  getProductsPaginated(
    page: number = 0,
    size: number = 12,
    sortBy: string = 'id',
    direction: string = 'asc'
  ): Observable<PaginatedResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('direction', direction);

    return this.http.get<PaginatedResponse>(`${this.apiUrl}/paginated`, { params });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/brands`);
  }

  getTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/types`);
  }

  // ========== MÉTODOS ADMINISTRATIVOS ==========

  createProduct(product: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  deleteProductPermanently(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/permanent`);
  }

  restoreProduct(id: number): Observable<Produto> {
    return this.http.patch<Produto>(`${this.apiUrl}/${id}/restore`, {});
  }

  updateStock(id: number, quantidade: number): Observable<Produto> {
    const params = new HttpParams().set('quantidade', quantidade.toString());
    return this.http.patch<Produto>(`${this.apiUrl}/${id}/stock`, {}, { params });
  }

  getLowStockProducts(minStock: number = 10): Observable<Produto[]> {
    const params = new HttpParams().set('minStock', minStock.toString());
    return this.http.get<Produto[]>(`${this.apiUrl}/low-stock`, { params });
  }
}

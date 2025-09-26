import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiPath}/auth`;
  private tokenKey = 'auth_token';

  // BehaviorSubject: fonte de verdade reativa
  private authSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.authSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // inicializa o estado e faz cleanup se token inválido
    const valid = this.hasValidToken();
    if (!valid) {
      localStorage.removeItem(this.tokenKey);
    }
    this.authSubject.next(valid);

    // sincroniza entre abas/janelas
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === this.tokenKey) {
        this.authSubject.next(this.hasValidToken());
      }
    });
  }

  // ----------------------
  // Autenticação (API)
  // ----------------------
  register(data: { cnpj: string; password: string }) {
    return this.http.post<{ token?: string }>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          if (response?.token) this.handleAuthSuccess(response.token);
        })
      );
  }

  login(data: { cnpj: string; password: string }) {
    return this.http.post<{ token?: string }>(`${this.apiUrl}/login`, data)
      .pipe(
        tap(response => {
          if (response?.token) this.handleAuthSuccess(response.token);
        })
      );
  }

  // ----------------------
  // Manipulação do token
  // ----------------------
  // Guarda token e atualiza BehaviorSubject
  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.authSubject.next(true);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
    this.authSubject.next(false);
  }

  // handler chamado ao receber token da API
  private handleAuthSuccess(token: string, navigateToHome = true) {
    if (!token) return;
    this.setToken(token);
    // navegação opcional: deixar o caller decidir é mais flexível.
    if (navigateToHome) {
      this.router.navigate(['/home']);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Retorna o payload decodificado (ou null)
  getTokenPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      return JSON.parse(atob(parts[1]));
    } catch {
      return null;
    }
  }

  // Usa a fonte reativa quando precisar do valor atual
  isAuthenticatedValue(): boolean {
    return this.authSubject.getValue();
  }

  logout(redirect = true) {
    this.clearToken();
    if (redirect) this.router.navigate(['']);
  }

  // Verifica validade do token (exp)
  private hasValidToken(): boolean {
    const payload = this.getTokenPayload();
    if (!payload) return false; // token ausente ou malformed
    // Se o token não traz "exp", decidir política:
    // atualmente consideramos válido (retorna true). Se você preferir que
    // tokens sem exp sejam considerados inválidos, retorne false aqui.
    if (!payload.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  }
}

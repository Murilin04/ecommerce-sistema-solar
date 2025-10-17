import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Integrador } from '../../features/models/integrador.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiPath}/auth`;
  private apiMail = `${environment.apiPath}`;
  private tokenKey = 'auth_token';

  // BehaviorSubject: fonte de verdade reativa
  private authSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.authSubject.asObservable();

  private roleChanged = new BehaviorSubject<void>(undefined);
  roleChanged$ = this.roleChanged.asObservable();

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
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
           this.toastr.show(
          'Olá, seja bem vido!(a)',
          'Success'
        );
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
    this.roleChanged.next();
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
    this.authSubject.next(false);
    this.roleChanged.next();
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

  getUserRole(): string | null {
    const payload = this.getTokenPayload();
    return payload?.role ?? null;
  }

  getUserId(): number | null {
    const payload = this.getTokenPayload();
    return payload?.id ?? null;
  }

  hasRole(role: string): boolean {
    const payload = this.getTokenPayload();
    if (!payload?.role) return false;
    // se role for string única:
    return (
      payload.role === role ||
      payload.role === `ROLE_${role}` ||
      payload.role === `ROLE_${role.toUpperCase()}`
    );
  }

  isAdmin(): boolean {
    const payload = this.getTokenPayload();
    return payload?.role === 'ADMIN';
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
  public hasValidToken(): boolean {
    const payload = this.getTokenPayload();
    if (!payload) return false; // token ausente ou malformed
    // Se o token não traz "exp", decidir política:
    // atualmente consideramos válido (retorna true). Se você preferir que
    // tokens sem exp sejam considerados inválidos, retorne false aqui.
    if (!payload.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  }

   // Conexão com endpoint para reset/update de senha do usuário. Passa o token e a nova senha para verificações e update pelo back-end.
  update(
    token: string,
    newPasswordWithEmail: { password: string; email: string }
  ): Observable<void> {
    // Define o cabeçalho do tipo json.
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // conexão com a url da api
    const url = `${this.apiMail}/password-reset/reset/${token}`;
    return this.http.post<void>(url, newPasswordWithEmail, { headers });
  }

  sendEmail(email: Integrador): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post(
      this.apiMail + '/password-reset/forgot?email=' + email.email,
      {
        headers: headers,
      }
    );
  }

  // requisita para o back-end um e-mail. Caso haja e-mail cadastrado, retorna bad request.
  checkEmail(email: string) {
    return this.http.get<any>(this.apiMail + '/integrador/check-email/' + email);
  }

}

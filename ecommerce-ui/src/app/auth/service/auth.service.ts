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

  private authSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.authSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  register(data: { cnpj: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => this.handleAuthSuccess(response.token))
      );
  }

  login(data: { cnpj: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data)
      .pipe(
        tap(response => this.handleAuthSuccess(response.token))
      );
  }

  private handleAuthSuccess(token: string | undefined) {
    if (!token) return;
    localStorage.setItem(this.tokenKey, token);
    this.authSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.authSubject.next(false);
    this.router.navigate(['/home']);
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload || !payload.exp) return true;
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }

}

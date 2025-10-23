import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Integrador } from '../../features/models/integrador.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IntegradorDTO } from '../../features/models/integradorDTO.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = `${environment.apiPath}/admin/integrador`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Integrador[]> {
    return this.http.get<Integrador[]>(this.apiUrl);
  }

  getProfile(id: number): Observable<IntegradorDTO> {
    return this.http.get<IntegradorDTO>(`${this.apiUrl}/${id}`);
  }

  create(integrador: Integrador): Observable<Integrador> {
    return this.http.post<Integrador>(this.apiUrl, integrador);
  }

  update(id: number, integrador: Integrador): Observable<Integrador> {
    return this.http.put<Integrador>(`${this.apiUrl}/${id}`, integrador);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updatePassword(id: number, data: { currentPassword: string; newPassword: string }): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/senha`, data);
  }
}

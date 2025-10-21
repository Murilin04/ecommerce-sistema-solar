import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { IntegradorDTO } from '../../models/integradorDTO.model';
import { Integrador } from '../../models/integrador.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiPath}/integrador`;

  constructor(private http: HttpClient) { }

  getAllProfiles(): Observable<Integrador[]> {
    return this.http.get<Integrador[]>(`${this.apiUrl}`);
  }

  getProfile(id: number): Observable<IntegradorDTO> {
    return this.http.get<IntegradorDTO>(`${this.apiUrl}/${id}`);
  }

  updateProfile(id: number, data: Partial<IntegradorDTO>): Observable<IntegradorDTO> {
    return this.http.put<IntegradorDTO>(`${this.apiUrl}/${id}`, data);
  }

  updatePassword(id: number, data: { currentPassword: string; newPassword: string }): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/senha`, data);
  }

  deleteProfile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}

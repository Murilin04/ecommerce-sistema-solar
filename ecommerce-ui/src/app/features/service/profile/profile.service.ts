import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Integrador } from '../../models/integrador.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiPath}/integrador`;

  constructor(private http: HttpClient) { }

  getProfile(cnpj: string): Observable<Integrador> {
    return this.http.get<Integrador>(`${this.apiUrl}/${cnpj}`);
  }

}

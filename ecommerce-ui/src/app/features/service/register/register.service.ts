import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Integrador } from '../../models/integrador.model';



@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = environment.apiPath + '/integrador';

  constructor(private http: HttpClient) {}

  cadastrarIntegrador(data: any): Observable<any> {
    return this.http.post<Integrador[]>(this.apiUrl, data);
  }

  listarIntegradores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

}

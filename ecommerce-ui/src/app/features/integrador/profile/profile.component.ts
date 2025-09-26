import { Component, OnInit } from '@angular/core';
import { MatCard } from "@angular/material/card";
import { Integrador } from '../../models/integrador.model';
import { ProfileService } from '../../service/profile/profile.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../../auth/service/auth.service';
import { TokenPayload } from '../../models/tokenPayload.model';


@Component({
  selector: 'app-profile',
  imports: [MatCard, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  profile?: Integrador;

  constructor(private profileService: ProfileService, private auth: AuthService) {}

  ngOnInit(): void {
    const token = this.auth.getToken();
    if (token) {
      const payload = jwtDecode<TokenPayload>(token);
      const cnpj = payload.sub; // se no backend `sub` for o id

      this.profileService.getProfile(cnpj).subscribe({
        next: (data) => (this.profile = data),
        error: (err) => {
          console.error('Erro ao carregar perfil:', err)
          alert('Não foi possível carregar seu perfil. Tente novamente.');
        }
      });
    }
  }

}

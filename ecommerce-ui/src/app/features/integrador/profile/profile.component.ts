import { Component, OnInit } from '@angular/core';
import { MatCard } from "@angular/material/card";
import { ProfileService } from '../../service/profile/profile.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../../auth/service/auth.service';
import { TokenPayload } from '../../models/tokenPayload.model';
import { Router } from '@angular/router';
import { IntegradorDTO } from '../../models/integradorDTO.model';


@Component({
  selector: 'app-profile',
  imports: [MatCard, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  profile?: IntegradorDTO;

  constructor(
    private profileService: ProfileService,
    private auth: AuthService,
    private router: Router) {}

  ngOnInit(): void {
    const token = this.auth.getToken();
    if (token) {
      const payload = jwtDecode<TokenPayload>(token);
      const cnpj = payload.sub;

      this.profileService.getProfile(cnpj).subscribe({
        next: (data) => (this.profile = data),
        error: (err) => {
          console.error('Erro ao carregar perfil:', err)
          alert('Não foi possível carregar seu perfil. Tente novamente.');
        }
      });
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

}

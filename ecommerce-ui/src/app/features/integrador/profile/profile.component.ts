import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { AuthService } from '../../../auth/service/auth.service';
import { IntegradorDTO } from '../../models/integradorDTO.model';
import { ProfileService } from '../../service/profile/profile.service';


@Component({
  selector: 'app-profile',
  imports: [MatCard, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profile!: IntegradorDTO;

  constructor(
    private profileService: ProfileService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.auth.getToken();
    if (token) {
      const payload = jwtDecode<{id: number}>(token);
      const id = payload.id;

      this.profileService.getProfile(id).subscribe({
        next: (data) => this.profile = data,
        error: (err) => console.error('Não foi possivel carregar seu perfil.', err)
      });
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}


import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { AuthService } from '../../../auth/service/auth.service';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm-dialog.component';
import { IntegradorDTO } from '../../models/integradorDTO.model';
import { ProfileService } from '../../service/profile/profile.service';


@Component({
  selector: 'app-profile',
  imports: [MatCard, CommonModule, MatButton, MatIconModule, MatDialogModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profile!: IntegradorDTO;

  constructor(
    private  profileService: ProfileService,
    private  auth: AuthService,
    private  router: Router,
    private  snackBar: MatSnackBar,
    private  dialog: MatDialog
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

  deleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir conta',
        message: 'Tem certeza que deseja excluir permanentemente sua conta? Esta ação não pode ser desfeita.',
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      this.performDelete();
    });
  }

  private performDelete(): void {
    const token = this.auth.getToken();
    if (!token) {
      this.snackBar.open('Token não encontrado. Faça login novamente.', 'OK', { duration: 3000 });
      this.router.navigate(['/home']);
      return;
    }

    try {
      const payload = jwtDecode<{ id: number }>(token);
      const id = payload.id;

      this.profileService.deleteProfile(id).subscribe({
        next: () => {
          if (typeof (this.auth as any).logout === 'function') {
            (this.auth as any).logout();
          }
          this.snackBar.open('Conta excluída com sucesso.', 'OK', { duration: 3000 });
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Erro ao excluir conta:', err);
          this.snackBar.open('Não foi possível excluir a conta. Tente novamente.', 'OK', { duration: 3000 });
        }
      });
    } catch (err) {
      console.error('Erro ao decodificar token:', err);
      this.snackBar.open('Erro interno. Faça login novamente e tente novamente.', 'OK', { duration: 3000 });
      this.router.navigate(['/home']);
    }
  }
}


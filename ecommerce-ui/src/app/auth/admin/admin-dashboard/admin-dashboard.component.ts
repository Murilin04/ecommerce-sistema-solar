import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Integrador } from '../../../features/models/integrador.model';
import { AdminService } from '../../service/admin.service';
import { AuthService } from '../../service/auth.service';
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule
],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {

  displayedColumns: string[] = ['companyName', 'cnpj', 'email', 'city', 'phone', 'actions'];
  dataSource =  new MatTableDataSource<Integrador>([]);
  isLoading = true;
  isAdmin = false;
  currentUserId?: number | null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private toastr: ToastrService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.auth.getUserId();
    this.loadUsers();
    this.isAdmin = this.auth.isAdmin();
  }

  loadUsers(): void {
    this.adminService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.toastr.error('Erro ao carregar usuários');
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editUser(user: Integrador): void {
    this.router.navigate(['/admin/editar', user.id]);
  }

  isCurrentUser(user: Integrador): boolean {
    return !!this.currentUserId && user.id === this.currentUserId;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  deleteUser(user: Integrador): void {
    if (this.isCurrentUser(user)) {
      this.toastr.warning('Não é possível excluir seu próprio usuário via painel.');
      return;
    }
    if (confirm(`Tem certeza que deseja excluir o cliente ${user.profile.companyName}?`)) {
      this.adminService.delete(user.id).subscribe({
        next: () => {
          this.toastr.success('Usuário excluído com sucesso');
          this.loadUsers();
        },
        error: () => this.toastr.error('Erro ao excluir usuário'),
      });
    }
  }

}

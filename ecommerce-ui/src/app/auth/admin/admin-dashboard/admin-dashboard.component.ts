import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Integrador } from '../../../features/models/integrador.model';
import { ProfileService } from '../../../features/service/profile/profile.service';

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
    MatFormFieldModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {

  displayedColumns: string[] = ['companyName', 'cnpj', 'email', 'city', 'phone', 'actions'];
  dataSource =  new MatTableDataSource<Integrador>([]);
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.profileService.getAllProfiles().subscribe({
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

  navigate(path: string) {
    this.router.navigate([path]);
  }

  deleteUser(user: Integrador): void {
    if (confirm(`Tem certeza que deseja excluir o cliente ${user.profile.companyName}?`)) {
      this.profileService.deleteProfile(user.id).subscribe({
        next: () => {
          this.toastr.success('Usuário excluído com sucesso');
          this.loadUsers();
        },
        error: () => this.toastr.error('Erro ao excluir usuário'),
      });
    }
  }

}

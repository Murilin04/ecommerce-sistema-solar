import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { IntegradorDTO } from '../../../features/models/integradorDTO.model';
import { ViacepService } from '../../../features/service/cep/viacep.service';
import { IbgeService } from '../../../features/service/ibge/ibge.service';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-admin-edit-users',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    NgxMaskDirective
  ],
  templateUrl: './admin-edit-users.component.html',
  styleUrl: './admin-edit-users.component.scss'
})
export class AdminEditUsersComponent {
  integrador!: IntegradorDTO;
  form!: FormGroup;
  formPassword!: FormGroup;

  estados: any[] = [];
  cidades: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ibgeService: IbgeService,
    private viaCepService: ViacepService,
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      cnpj: [''],
      stateRegistration: [''],
      companyName: [''],
      tradeName: [''],
      postalCode: [''],
      state: [''],
      city: [''],
      address: [''],
      addressNumber: [''],
      addressComplement: [''],
      neighborhood: [''],
      email: ['', [Validators.email]],
      phone: [''],
      whatsapp: ['']
    });

    this.formPassword = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });

    // Buscar perfil
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.adminService.getProfile(id).subscribe({
        next: (data) => {
          this.integrador = data;
          this.form.patchValue(data);
        },
        error: (err) => {
          console.error('Error ao carregar perfil:', err)
          this.toastr.error('Usuário não encontrado.');
          this.router.navigate(['/admin']);
        }
      });
    }

    // carregar estados do IBGE
    this.ibgeService.getEstados().subscribe({
      next: (data) => this.estados = data,
      error: (err) => console.error('Erro ao carregar estados:', err)
    });

    // validar CEP enquanto o usuario digitar
    this.form.get('postalCode')?.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((cep) => {
        if (cep && cep.length === 8) this.buscarCep(cep);
      });

  }

   buscarCep(cep: string) {
    this.viaCepService.buscarCep(cep).subscribe({
      next: (data) => {
        if (!data.erro) {
          this.form.patchValue({
            address: data.logradouro,
            neighborhood: data.bairro,
            state: data.uf,
            city: data.localidade
          });

          this.ibgeService.getCidades(data.uf).subscribe({
            next: (cidades) => {
              this.cidades = cidades;
              this.form.patchValue({ city: data.localidade });
            },
            error: (err) => console.error('Erro ao carregar cidades:', err)
          });
        } else {
          this.form.get('postalCode')?.setErrors({ invalidCep: true });
        }
      },
      error: () => this.form.get('postalCode')?.setErrors({ invalidCep: true })
    });
  }

  onEstadoChange(estado: string) {
    this.ibgeService.getCidades(estado).subscribe({
      next: (data) => {
        this.cidades = data;
        this.form.patchValue({ city: '' });
      },
      error: (err) => console.error('Erro ao carregar cidades:', err)
    });
  }

  salvar() {
    if (this.form.valid && this.integrador) {
      this.adminService.update(this.integrador.id, this.form.value)
        .subscribe({
          next: (data) => {
            this.integrador = data;
            this.toastr.success('Dados atualizados com sucesso!');
            this.router.navigate(['/admin']);
          },
          error: (err) => console.error('Erro ao atualizar perfil:', err)
        });
    }
  }

  salvarSenha() {
    if (this.formPassword.valid && this.integrador) {
      this.adminService.updatePassword(this.integrador.id, this.formPassword.value)
        .subscribe({
          next: () => {
            this.toastr.success('Senha alterada com sucesso!');
            this.formPassword.reset();
          },
          error: (err) => console.error('Erro ao atualizar senha:', err.message)
        });
    }
  }

  cancelar() {
    this.form.reset();
    this.router.navigate(['/admin']);
  }
}

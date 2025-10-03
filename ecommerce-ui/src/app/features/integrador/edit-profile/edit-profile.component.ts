import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { IbgeService } from '../../service/ibge/ibge.service';
import { ViacepService } from '../../service/cep/viacep.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSelectModule } from "@angular/material/select";
import { NgxMaskDirective } from 'ngx-mask';
import { ProfileService } from '../../service/profile/profile.service';
import { jwtDecode } from 'jwt-decode';
import { IntegradorDTO } from '../../models/integradorDTO.model';

@Component({
  selector: 'app-edit-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    NgxMaskDirective
],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit{
  integrador!: IntegradorDTO;
  form!: FormGroup;
  formPassword!: FormGroup;

  estados: any[] = [];
  cidades: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ibgeService: IbgeService,
    private viaCepService: ViacepService,
    private profileService: ProfileService) {}

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

    // carregar estados do IBGE
    this.ibgeService.getEstados().subscribe({
      next: (data) => {
        this.estados = data;
      },
      error: (err) => console.error('Erro ao carregar estados:', err),
    });

    // validar CEP enquanto o usuario digitar
    this.form
      .get('postalCode')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((cep) => {
        if (cep && cep.length === 8) {
          this.buscarCep(cep);
        }
      });

    // Buscar perfil do usuário logado
    const token = localStorage.getItem('auth_token');
    if (token) {
      const payload: any = jwtDecode(token);
      const cnpj = payload.sub;

      this.profileService.getProfile(cnpj).subscribe({
        next: (data) => {
          this.integrador = data;
          this.form.patchValue(data); // popula os campos
        },
        error: (err) => console.error('Erro ao carregar perfil', err),
      });
    }

    this.formPassword = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
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

          // busca cidades da UF para adicionar ao select
          this.ibgeService.getCidades(data.uf).subscribe({
            next: (cidades) => {
              this.cidades = cidades;
              this.form.patchValue({ cidade: data.localidade });
            },
            error: (err) => console.error('Erro as carregar cidades:', err)
          });

        } else {
          this.form.get('postalCode')?.setErrors({ invalidCep: true });
        }
      },
      error: () => {
        this.form.get('postalCode')?.setErrors({ invalidCep: true });
      }
    });
  }

  onEstadoChange(estado: string) {
    this.ibgeService.getCidades(estado).subscribe({
      next: (data) => {
        this.cidades = data;
        this.form.patchValue({ cidade: '' });
      },
      error: (err) => console.error('Erro ao carregar cidades:', err)
    });
  }


  salvar() {
    if (this.form.valid && this.integrador) {
      const dadosAtualizados: Partial<IntegradorDTO> = this.form.value;

      this.profileService.updateProfile(this.integrador.id, dadosAtualizados).subscribe({
          next: (data) => {
            this.integrador = data;
            this.router.navigate(['/perfil']); // volta para a tela de perfil
          },
          error: (err) => console.error('Erro ao atualizar perfil:', err)
      });
      console.log('Dados salvos:', this.form.value);
    }
  }

  salvarSenha() {
    if (this.formPassword.valid && this.integrador) {
      this.profileService.updatePassword(this.integrador.id, this.formPassword.value).subscribe({
        next: () => {
          alert('Senha alterada com sucesso');
          this.formPassword.reset();
        },
        error: (err) => alert('Erro ao atualizar senha: ' + err.message),
      });
    }
  }

  cancelar() {
    this.form.reset();
    this.router.navigate(['perfil'])
  }

}

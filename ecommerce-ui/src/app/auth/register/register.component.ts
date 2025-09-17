import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../../features/service/register/register.service';
import { CommonModule } from '@angular/common';
import { IbgeService } from '../../features/service/ibge/ibge.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NgxMaskDirective } from 'ngx-mask';
import { ViacepService } from '../../features/service/cep/viacep.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCardModule,
    CommonModule,
    NgxMaskDirective
],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{

  cadastroForm: FormGroup;

  estados: any[] = [];
  cidades: any[] = [];

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private ibgeService: IbgeService,
    private viaCepService: ViacepService,
    private overlay: OverlayContainer
  ) {
    this.cadastroForm = this.fb.group({
      cnpj: ['', Validators.required],
      inscricao_estadual: [''],
      sou_mei: [false],
      companyName: ['', Validators.required],
      nome_fantasia: [''],
      postalCode: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      addressNumber: ['', Validators.required],
      complemento: [''],
      neighborhood: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      whatsapp: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
    // carregar estados do IBGE
    this.ibgeService.getEstados().subscribe({
      next: (data) => {
        this.estados = data;
      },
      error: (err) => console.error('Erro ao carregar estados:', err)
    });

    // validar CEP enquanto o usuario digitar
    this.cadastroForm.get('postalCode')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(cep => {
        if (cep && cep.length === 8) {
          this.buscarCep(cep);
        }
      });

    this.overlay.getContainerElement().classList.add('my-app-overlay');
  }

  buscarCep(cep: string) {
    this.viaCepService.buscarCep(cep).subscribe({
      next: (data) => {
        if (!data.erro) {
          this.cadastroForm.patchValue({
            address: data.logradouro,
            neighborhood: data.bairro,
            state: data.uf,
            city: data.localidade
          });

          // busca cidades da UF para adicionar ao select
          this.ibgeService.getCidades(data.uf).subscribe({
            next: (cidades) => {
              this.cidades = cidades;
              this.cadastroForm.patchValue({ cidade: data.localidade });
            },
            error: (err) => console.error('Erro as carregar cidades:', err)
          });

        } else {
          this.cadastroForm.get('postalCode')?.setErrors({ invalidCep: true });
        }
      },
      error: () => {
        this.cadastroForm.get('postalCode')?.setErrors({ invalidCep: true });
      }
    });
  }

  onEstadoChange(estado: string) {
    this.ibgeService.getCidades(estado).subscribe({
      next: (data) => {
        this.cidades = data;
        this.cadastroForm.patchValue({ cidade: '' });
      },
      error: (err) => console.error('Erro ao carregar cidades:', err)
    });
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      this.registerService
        .cadastrarIntegrador(this.cadastroForm.value)
        .subscribe({
          next: (data) => {
            console.log('Integrador cadastrado:', data);
            this.cadastroForm.reset(); // reseta o formulário
          },
          error: (err) => {
            console.error('Erro ao cadastrar:', err);
          },
        });
    } else {
      this.cadastroForm.markAllAsTouched();
    }
  }

}

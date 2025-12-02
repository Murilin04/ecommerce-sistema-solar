import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthService } from '../../service/auth.service';
import { IbgeService } from '../../../features/service/ibge/ibge.service';
import { ViacepService } from '../../../features/service/cep/viacep.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-admin-register',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCardModule,
    CommonModule,
    NgxMaskDirective,
  ],
  templateUrl: './admin-register.component.html',
  styleUrl: './admin-register.component.scss'
})
export class AdminRegisterComponent implements OnInit {
  cadastroForm: FormGroup;

  estados: any[] = [];
  cidades: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private ibgeService: IbgeService,
    private viaCepService: ViacepService,
    private overlay: OverlayContainer,
    private router: Router
  ) {
    this.cadastroForm = this.fb.group({
      cnpj: ['', Validators.required],
      stateRegistration: [''],
      isMei: [false],
      companyName: ['', Validators.required],
      tradeName: [''],
      postalCode: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      addressNumber: ['', Validators.required],
      addressComplement: [''],
      neighborhood: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailAsyncValidator()]
      ],
      phone: ['', Validators.required],
      whatsapp: [''],
      password: [''],
      role: ['']
    });
  }

  ngOnInit(): void {
    // carregar estados do IBGE
    this.ibgeService.getEstados().subscribe({
      next: (data) => {
        this.estados = data;
      },
      error: (err) => console.error('Erro ao carregar estados:', err),
    });

    // validar CEP enquanto o usuario digitar
    this.cadastroForm
      .get('postalCode')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((cep) => {
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
            city: data.localidade,
          });

          // busca cidades da UF para adicionar ao select
          this.ibgeService.getCidades(data.uf).subscribe({
            next: (cidades) => {
              this.cidades = cidades;
              this.cadastroForm.patchValue({ cidade: data.localidade });
            },
            error: (err) => console.error('Erro as carregar cidades:', err),
          });
        } else {
          this.cadastroForm.get('postalCode')?.setErrors({ invalidCep: true });
        }
      },
      error: () => {
        this.cadastroForm.get('postalCode')?.setErrors({ invalidCep: true });
      },
    });
  }

  onEstadoChange(estado: string) {
    this.ibgeService.getCidades(estado).subscribe({
      next: (data) => {
        this.cidades = data;
        this.cadastroForm.patchValue({ cidade: '' });
      },
      error: (err) => console.error('Erro ao carregar cidades:', err),
    });
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      this.authService.register(this.cadastroForm.value).subscribe({
        next: (data) => {
          this.cadastroForm.reset(); // reseta o formulário
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Erro ao cadastrar:', err);
        },
      });
    } else {
      this.cadastroForm.markAllAsTouched();
    }
  }

  emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);

      return of(control.value).pipe(
        debounceTime(500),
        switchMap((email) => this.authService.checkEmailAvailability(email)),
        map((exists) => (exists ? { emailTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

}

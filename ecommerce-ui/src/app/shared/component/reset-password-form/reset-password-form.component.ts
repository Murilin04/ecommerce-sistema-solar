import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/service/auth.service';
import { Integrador } from '../../../features/models/integrador.model';
import { LoadingComponent } from '../loading/loading.component';

function passwordMatchValidator(control: FormGroup): { [key: string]: any } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  const passwordsDoNotMatch =
    password && confirmPassword && password.value !== confirmPassword.value;

  if (passwordsDoNotMatch) {
    password.setErrors({ passwordsDoNotMatch: true });
    confirmPassword.setErrors({ passwordsDoNotMatch: true });
    return { passwordsDoNotMatch: true };
  }

  password?.setErrors(null);
  confirmPassword?.setErrors(null);
  return null;
}

@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [
    LoadingComponent,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatProgressBarModule,
    ToastrModule,
    ReactiveFormsModule
  ],
  templateUrl: './reset-password-form.component.html',
  styleUrl: './reset-password-form.component.scss'
})
export class ResetPasswordFormComponent implements OnInit {
  form: FormGroup;
  email: string | null = null;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private userService: AuthService
  ) {
    this.form = this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params) {
        this.email = params.get('email');
        this.token = params.get('token');
      }
    });
  }

  resetPasswordForm(): void {
    if (this.form.invalid) return;

    if (this.form.valid && this.token && this.email) {
      const userData: Integrador = {
        id: 0,
        cnpj: '',
        email: this.email,
        password: this.form.value.password,
        role: 'ROLE_USER',
        profile: {
          stateRegistration: '',
          isMei: false,
          companyName: '',
          tradeName: '',
          postalCode: '',
          state: '',
          city: '',
          address: '',
          addressNumber: '',
          addressComplement: '',
          neighborhood: '',
          phone: '',
          whatsapp: ''
        }
      };

      this.userService.update(this.token, userData).subscribe({
        complete: () => {
          this.toastr.success('Sua senha foi alterada!', 'Sucesso');
          this.form.reset();
          this.router.navigate(['']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.toastr.error('Token inválido ou expirado!', 'Erro');
          } else {
            this.toastr.error('Erro ao alterar senha', 'Erro');
          }
        },
      });
    }
  }
}

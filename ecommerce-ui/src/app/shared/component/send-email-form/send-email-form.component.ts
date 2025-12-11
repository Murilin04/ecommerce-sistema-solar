import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../auth/service/auth.service';
import { LoadingComponent } from '../loading/loading.component';


@Component({
  selector: 'app-send-email-form',
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
    ReactiveFormsModule],
  templateUrl: './send-email-form.component.html',
  styleUrl: './send-email-form.component.scss'
})
export class SendEmailFormComponent {
  formSignUp: FormGroup;
  formSendEmail: FormGroup;
  selectedIndex: number = 0;

  constructor(
    private userService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.formSignUp = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.formSendEmail = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
    });
  }

  sendEmailForm() {
    if (this.formSendEmail.invalid) return;

    this.userService.sendEmail(this.formSendEmail.value).subscribe({
      next: () => {
        this.formSendEmail.disable();
        this.toastr.success(
          'Enviamos um link de redefinição para o seu e-mail!',
          'Sucesso'
        );
      },
      error: (err) => {
        this.toastr.error(
          'E-mail não cadastrado! Tente novamente.',
          'Erro'
        );
      },
    });
  }
}

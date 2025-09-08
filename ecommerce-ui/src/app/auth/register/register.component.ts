import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../../features/register.service';
import { CommonModule } from '@angular/common';

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
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  cadastroForm: FormGroup;

  estados = ['SP', 'RJ', 'MG', 'RS', 'PR']; // exemplo
  cidades = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte']; // pode ser carregado dinamicamente

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService
  ) {
    this.cadastroForm = this.fb.group({
      cnpj: ['', Validators.required],
      inscricao_estadual: [''],
      sou_mei: [false],
      razao_social: ['', Validators.required],
      nome_fantasia: [''],
      cep: ['', Validators.required],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone_comercial: [''],
      whatsapp: [''],
      senha: ['']
    });
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      this.registerService
        .cadastrarIntegrador(this.cadastroForm.value)
        .subscribe({
          next: (data) => {
            console.log('Integrador cadastrado:', data);
            this.cadastroForm.reset(); // ✅ reseta o formulário
          },
          error: (err) => {
            console.error('Erro ao cadastrar:', err);
          },
        });

    }
  }

}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <div class="logo">
            <h1>ServControl</h1>
            <p>Cadastro no Sistema</p>
          </div>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Nome Completo</label>
              <input
                id="name"
                type="text"
                formControlName="name"
                class="form-input"
                [class.error]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
                placeholder="Seu nome completo"
              />
              <div *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched" class="error-message">
                <span *ngIf="registerForm.get('name')?.errors?.['required']">Nome é obrigatório</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="email">E-mail</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="form-input"
                [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                placeholder="seu@email.com"
              />
              <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="error-message">
                <span *ngIf="registerForm.get('email')?.errors?.['required']">E-mail é obrigatório</span>
                <span *ngIf="registerForm.get('email')?.errors?.['email']">E-mail inválido</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password">Senha</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="form-input"
                [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                placeholder="Digite sua senha"
              />
              <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="error-message">
                <span *ngIf="registerForm.get('password')?.errors?.['required']">Senha é obrigatória</span>
                <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Senha deve ter pelo menos 6 caracteres</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="confirmPassword">Confirmar Senha</label>
              <input
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                class="form-input"
                [class.error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                placeholder="Confirme sua senha"
              />
              <div *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched" class="error-message">
                <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Confirmação é obrigatória</span>
                <span *ngIf="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched">Senhas não coincidem</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="register-btn"
            [disabled]="registerForm.invalid || loading"
            [class.loading]="loading"
          >
            <span *ngIf="loading" class="spinner"></span>
            <span *ngIf="!loading">Cadastrar</span>
            <span *ngIf="loading">Cadastrando...</span>
          </button>

          <div *ngIf="errorMessage" class="register-error">
            <span class="material-icons">error</span>
            {{ errorMessage }}
          </div>
        </form>

        <div class="register-footer">
          <p>Já tem uma conta? <a routerLink="/auth/login">Faça login aqui</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .register-card {
      background: white;
      width: 100%;
      max-width: 500px;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      overflow: hidden;
    }

    .register-header {
      padding: 2rem 2rem 1rem;
      text-align: center;
      background: #1976d2;
      color: white;
    }

    .logo h1 {
      margin: 0 0 0.5rem;
      font-size: 2rem;
      font-weight: 700;
    }

    .logo p {
      margin: 0;
      opacity: 0.9;
      font-size: 0.875rem;
    }

    .register-form {
      padding: 2rem;
    }

    .form-row {
      margin-bottom: 1.5rem;
    }

    .form-group {
      width: 100%;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.875rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .register-btn {
      width: 100%;
      background: #1976d2;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .register-btn:hover:not(:disabled) {
      background: #1565c0;
    }

    .register-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .register-error {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 1rem;
      padding: 0.75rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
    }

    .register-footer {
      padding: 1.5rem 2rem;
      text-align: center;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    .register-footer p {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .register-footer a {
      color: #1976d2;
      text-decoration: none;
      font-weight: 600;
    }

    .register-footer a:hover {
      text-decoration: underline;
    }

    .material-icons {
      font-size: 1.25rem;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      // Simulate API call
      setTimeout(() => {
        console.log('Registro:', this.registerForm.value);
        // Mock successful registration
        this.router.navigate(['/auth/login'], { 
          queryParams: { registered: 'true' } 
        });
        this.loading = false;
      }, 2000);
    }
  }
}

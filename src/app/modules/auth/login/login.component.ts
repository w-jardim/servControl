import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <h1>ServControl</h1>
            <p>Sistema de Controle de Plantões</p>
          </div>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email">E-mail</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="form-input"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              placeholder="seu@email.com"
            />
            <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="error-message">
              <span *ngIf="loginForm.get('email')?.errors?.['required']">E-mail é obrigatório</span>
              <span *ngIf="loginForm.get('email')?.errors?.['email']">E-mail inválido</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Senha</label>
            <div class="password-input">
              <input
                id="password"
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                class="form-input"
                [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                class="password-toggle"
                (click)="togglePassword()"
              >
                <span class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error-message">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">Senha é obrigatória</span>
              <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Senha deve ter pelo menos 6 caracteres</span>
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="rememberMe" />
              <span class="checkmark"></span>
              Lembrar de mim
            </label>
            <a href="#" class="forgot-password" (click)="forgotPassword()">Esqueci minha senha</a>
          </div>

          <button
            type="submit"
            class="login-btn"
            [disabled]="loginForm.invalid || loading"
            [class.loading]="loading"
          >
            <span *ngIf="loading" class="spinner"></span>
            <span *ngIf="!loading">Entrar</span>
            <span *ngIf="loading">Entrando...</span>
          </button>

          <div *ngIf="errorMessage" class="login-error">
            <span class="material-icons">error</span>
            {{ errorMessage }}
          </div>
        </form>

        <div class="login-footer">
          <p>Não tem uma conta? <a routerLink="/auth/register">Cadastre-se aqui</a></p>
        </div>
      </div>

      <div class="login-info">
        <div class="info-card">
          <h3>Bem-vindo ao ServControl</h3>
          <ul>
            <li>Gerencie seus plantões de forma eficiente</li>
            <li>Solicite trocas de plantões</li>
            <li>Acompanhe seus pagamentos</li>
            <li>Visualize relatórios detalhados</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      background: white;
      width: 100%;
      max-width: 400px;
      margin: auto;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      overflow: hidden;
    }

    .login-header {
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

    .login-form {
      padding: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
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

    .password-input {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #6b7280;
    }

    .password-toggle:hover {
      color: #374151;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 0.875rem;
      color: #374151;
    }

    .checkbox-label input {
      margin-right: 0.5rem;
    }

    .forgot-password {
      color: #1976d2;
      text-decoration: none;
      font-size: 0.875rem;
    }

    .forgot-password:hover {
      text-decoration: underline;
    }

    .login-btn {
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
    }

    .login-btn:hover:not(:disabled) {
      background: #1565c0;
    }

    .login-btn:disabled {
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

    .login-error {
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

    .login-footer {
      padding: 1.5rem 2rem;
      text-align: center;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    .login-footer p {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .login-footer a {
      color: #1976d2;
      text-decoration: none;
      font-weight: 600;
    }

    .login-footer a:hover {
      text-decoration: underline;
    }

    .login-info {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .info-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 2rem;
      color: white;
      max-width: 400px;
    }

    .info-card h3 {
      margin: 0 0 1.5rem;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .info-card ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .info-card li {
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
    }

    .info-card li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #4ade80;
      font-weight: bold;
    }

    .material-icons {
      font-size: 1.25rem;
    }

    @media (max-width: 768px) {
      .login-container {
        flex-direction: column;
      }

      .login-info {
        order: -1;
        padding: 1rem;
      }

      .login-card {
        margin: 1rem;
      }

      .info-card {
        text-align: center;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      // Simulate API call
      setTimeout(() => {
        const { email, password } = this.loginForm.value;
        
        // Mock authentication
        if (email === 'admin@servcontrol.com' && password === 'admin123') {
          localStorage.setItem('token', 'mock-jwt-token');
          localStorage.setItem('user', JSON.stringify({
            id: '1',
            name: 'Dr. Administrador',
            email: email,
            role: 'admin'
          }));
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'E-mail ou senha inválidos';
        }
        
        this.loading = false;
      }, 2000);
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  forgotPassword(): void {
    // Implement forgot password logic
    console.log('Forgot password clicked');
  }
}

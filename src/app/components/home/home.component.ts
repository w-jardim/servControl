import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <div class="home-content">
        <div class="logo-section">
          <h1>ServControl</h1>
          <p>Sistema de Controle de Plantões</p>
        </div>
        
        <div class="welcome-section">
          <h2>Bem-vindo</h2>
          <p>Acesse o sistema para gerenciar seus plantões e atividades.</p>
        </div>

        <div class="action-buttons">
          <a routerLink="/auth/login" class="btn btn-primary">Fazer Login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .home-content {
      background: white;
      border-radius: 12px;
      padding: 3rem 2rem;
      text-align: center;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      max-width: 500px;
      width: 100%;
    }

    .logo-section h1 {
      margin: 0 0 0.5rem;
      font-size: 2.5rem;
      font-weight: 700;
      color: #1976d2;
    }

    .logo-section p {
      margin: 0 0 2rem;
      color: #6b7280;
      font-size: 1rem;
    }

    .welcome-section h2 {
      margin: 0 0 1rem;
      font-size: 1.5rem;
      color: #374151;
    }

    .welcome-section p {
      margin: 0 0 2rem;
      color: #6b7280;
      line-height: 1.6;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.875rem;
      transition: background-color 0.2s, transform 0.1s;
    }

    .btn-primary {
      background: #1976d2;
      color: white;
    }

    .btn-primary:hover {
      background: #1565c0;
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .home-content {
        padding: 2rem 1rem;
      }

      .logo-section h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class HomeComponent {
}
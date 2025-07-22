import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Bem-vindo ao ServControl</p>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-card">
          <div class="card-icon">📅</div>
          <div class="card-content">
            <h3>Plantões</h3>
            <p class="card-number">12</p>
            <p class="card-text">Este mês</p>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="card-icon">🔄</div>
          <div class="card-content">
            <h3>Trocas Pendentes</h3>
            <p class="card-number">3</p>
            <p class="card-text">Aguardando aprovação</p>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="card-icon">💰</div>
          <div class="card-content">
            <h3>Pagamentos</h3>
            <p class="card-number">R$ 2.400</p>
            <p class="card-text">Este mês</p>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="card-icon">👥</div>
          <div class="card-content">
            <h3>Usuários</h3>
            <p class="card-number">24</p>
            <p class="card-text">Ativos</p>
          </div>
        </div>
      </div>

      <div class="dashboard-section">
        <div class="section-header">
          <h2>Próximos Plantões</h2>
          <a href="/plantao" class="view-all">Ver todos</a>
        </div>
        
        <div class="plantoes-list">
          <div class="plantao-item">
            <div class="plantao-date">
              <span class="day">25</span>
              <span class="month">JUL</span>
            </div>
            <div class="plantao-info">
              <h4>Plantão Noturno</h4>
              <p>19:00 - 07:00</p>
            </div>
            <div class="plantao-status pending">Pendente</div>
          </div>

          <div class="plantao-item">
            <div class="plantao-date">
              <span class="day">27</span>
              <span class="month">JUL</span>
            </div>
            <div class="plantao-info">
              <h4>Plantão Diurno</h4>
              <p>07:00 - 19:00</p>
            </div>
            <div class="plantao-status confirmed">Confirmado</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      margin: 0 0 0.5rem;
      color: #1f2937;
      font-size: 2rem;
      font-weight: 700;
    }

    .dashboard-header p {
      margin: 0;
      color: #6b7280;
      font-size: 1rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .dashboard-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .dashboard-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .card-icon {
      font-size: 2.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-content h3 {
      margin: 0 0 0.5rem;
      color: #374151;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .card-number {
      margin: 0 0 0.25rem;
      color: #1f2937;
      font-size: 1.75rem;
      font-weight: 700;
    }

    .card-text {
      margin: 0;
      color: #6b7280;
      font-size: 0.75rem;
    }

    .dashboard-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      margin: 0;
      color: #1f2937;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .view-all {
      color: #1976d2;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    .plantoes-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .plantao-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      transition: background-color 0.2s;
    }

    .plantao-item:hover {
      background-color: #f9fafb;
    }

    .plantao-date {
      text-align: center;
      min-width: 60px;
    }

    .plantao-date .day {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    .plantao-date .month {
      display: block;
      font-size: 0.75rem;
      color: #6b7280;
      text-transform: uppercase;
    }

    .plantao-info {
      flex: 1;
    }

    .plantao-info h4 {
      margin: 0 0 0.25rem;
      color: #1f2937;
      font-size: 1rem;
      font-weight: 600;
    }

    .plantao-info p {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .plantao-status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .plantao-status.pending {
      background: #fef3c7;
      color: #d97706;
    }

    .plantao-status.confirmed {
      background: #d1fae5;
      color: #065f46;
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 1rem;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .plantao-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .plantao-date {
        align-self: flex-start;
      }
    }
  `]
})
export class Dashboard implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

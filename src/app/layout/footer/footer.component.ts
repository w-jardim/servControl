import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-left">
          <div class="footer-logo">
            <span class="logo-text">ServControl</span>
            <span class="version">v{{ version }}</span>
          </div>
          <p class="footer-description">
            Sistema de Controle de Plantões Médicos
          </p>
        </div>

        <div class="footer-center">
          <div class="footer-links">
            <a href="#" class="footer-link">Política de Privacidade</a>
            <a href="#" class="footer-link">Termos de Uso</a>
            <a href="#" class="footer-link">Suporte</a>
            <a href="#" class="footer-link">Documentação</a>
          </div>
        </div>

        <div class="footer-right">
          <div class="footer-status">
            <div class="status-item">
              <span class="status-dot" [class]="getStatusClass()"></span>
              <span class="status-text">{{ getStatusText() }}</span>
            </div>
            <div class="last-update">
              Última atualização: {{ lastUpdate | date:'dd/MM/yyyy HH:mm' }}
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © {{ currentYear }} ServControl. Todos os direitos reservados.
          </p>
          <div class="footer-tech">
            <span class="tech-item">Angular {{ angularVersion }}</span>
            <span class="tech-item">TypeScript {{ typescriptVersion }}</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #1e293b;
      color: #cbd5e1;
      margin-top: auto;
      border-top: 1px solid #334155;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      gap: 2rem;
    }

    .footer-left {
      flex: 1;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: #2196f3;
    }

    .version {
      background: #334155;
      color: #94a3b8;
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      font-size: 0.625rem;
      font-weight: 500;
    }

    .footer-description {
      color: #94a3b8;
      font-size: 0.875rem;
      margin: 0;
      line-height: 1.5;
    }

    .footer-center {
      flex: 1;
    }

    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .footer-link {
      color: #cbd5e1;
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.2s ease;
    }

    .footer-link:hover {
      color: #2196f3;
    }

    .footer-right {
      flex: 1;
      text-align: right;
    }

    .footer-status {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-end;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-dot.online {
      background-color: #10b981;
    }

    .status-dot.offline {
      background-color: #ef4444;
    }

    .status-dot.maintenance {
      background-color: #f59e0b;
    }

    .status-text {
      color: #cbd5e1;
    }

    .last-update {
      font-size: 0.75rem;
      color: #64748b;
    }

    .footer-bottom {
      border-top: 1px solid #334155;
      background: #0f172a;
    }

    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .copyright {
      color: #64748b;
      font-size: 0.75rem;
      margin: 0;
    }

    .footer-tech {
      display: flex;
      gap: 1rem;
    }

    .tech-item {
      color: #64748b;
      font-size: 0.75rem;
      background: #1e293b;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        gap: 1.5rem;
      }

      .footer-right {
        text-align: left;
      }

      .footer-status {
        align-items: flex-start;
      }

      .footer-bottom-content {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }

      .footer-links {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem;
      }
    }
  `]
})
export class FooterComponent implements OnInit {
  version = '1.0.0';
  currentYear = new Date().getFullYear();
  lastUpdate = new Date();
  angularVersion = '20.1.1';
  typescriptVersion = '5.8.3';
  systemStatus: 'online' | 'offline' | 'maintenance' = 'online';

  constructor() {}

  ngOnInit(): void {
    this.checkSystemStatus();
  }

  getStatusClass(): string {
    return this.systemStatus;
  }

  getStatusText(): string {
    const statusTexts = {
      online: 'Sistema Online',
      offline: 'Sistema Offline',
      maintenance: 'Em Manutenção'
    };
    return statusTexts[this.systemStatus];
  }

  private checkSystemStatus(): void {
    // In a real application, this would check the actual system status
    // For now, we'll simulate an online status
    this.systemStatus = 'online';
  }
}

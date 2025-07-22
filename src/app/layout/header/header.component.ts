import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="header">
      <div class="header-left">
        <button class="menu-toggle" (click)="onMenuToggle()">
          <span class="material-icons">menu</span>
        </button>
        <div class="logo">
          <h1>ServControl</h1>
        </div>
      </div>

      <div class="header-center">
        <div class="search-container">
          <span class="material-icons search-icon">search</span>
          <input 
            type="text" 
            placeholder="Buscar plantões, médicos..."
            class="search-input"
            [(ngModel)]="searchTerm"
            (keyup.enter)="onSearch()">
        </div>
      </div>

      <div class="header-right">
        <div class="header-actions">
          <button class="header-btn" [class.active]="hasNotifications" (click)="toggleNotifications()">
            <span class="material-icons">notifications</span>
            <span *ngIf="notificationCount > 0" class="notification-badge">{{ notificationCount }}</span>
          </button>

          <button class="header-btn" (click)="toggleSettings()">
            <span class="material-icons">settings</span>
          </button>

          <div class="user-menu" [class.open]="userMenuOpen">
            <button class="user-btn" (click)="toggleUserMenu()">
              <div class="user-avatar">
                <img *ngIf="currentUser?.foto" [src]="currentUser.foto" [alt]="currentUser.name">
                <span *ngIf="!currentUser?.foto" class="material-icons">person</span>
              </div>
              <div class="user-info">
                <span class="user-name">{{ currentUser.name || 'Usuário' }}</span>
                <span class="user-role">{{ currentUser.role || 'Médico' }}</span>
              </div>
              <span class="material-icons">keyboard_arrow_down</span>
            </button>

            <div class="user-dropdown" *ngIf="userMenuOpen">
              <a href="#" class="dropdown-item" (click)="goToProfile()">
                <span class="material-icons">person</span>
                Meu Perfil
              </a>
              <a href="#" class="dropdown-item" (click)="goToSettings()">
                <span class="material-icons">settings</span>
                Configurações
              </a>
              <hr class="dropdown-divider">
              <a href="#" class="dropdown-item" (click)="logout()">
                <span class="material-icons">logout</span>
                Sair
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications Panel -->
      <div class="notifications-panel" *ngIf="notificationsOpen" (click)="closeNotifications()">
        <div class="notifications-content" (click)="$event.stopPropagation()">
          <div class="notifications-header">
            <h3>Notificações</h3>
            <button class="close-btn" (click)="closeNotifications()">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div class="notifications-list">
            <div *ngFor="let notification of notifications" class="notification-item" [class.unread]="!notification.read">
              <div class="notification-icon">
                <span class="material-icons">{{ getNotificationIcon(notification.type) }}</span>
              </div>
              <div class="notification-content">
                <div class="notification-title">{{ notification.title }}</div>
                <div class="notification-message">{{ notification.message }}</div>
                <div class="notification-time">{{ notification.time | date:'short' }}</div>
              </div>
            </div>
            <div *ngIf="notifications.length === 0" class="no-notifications">
              Nenhuma notificação
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .menu-toggle {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .menu-toggle:hover {
      background-color: #f5f5f5;
    }

    .logo h1 {
      color: #1976d2;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }

    .header-center {
      flex: 1;
      max-width: 600px;
      margin: 0 2rem;
    }

    .search-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      color: #666;
      z-index: 1;
    }

    .search-input {
      width: 100%;
      padding: 0.5rem 0.5rem 0.5rem 2.5rem;
      border: 1px solid #ddd;
      border-radius: 20px;
      font-size: 0.875rem;
      background-color: #f5f5f5;
    }

    .search-input:focus {
      outline: none;
      border-color: #1976d2;
      background-color: white;
    }

    .header-right {
      display: flex;
      align-items: center;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .header-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .header-btn:hover {
      background-color: #f5f5f5;
    }

    .header-btn.active {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .notification-badge {
      position: absolute;
      top: 0;
      right: 0;
      background-color: #f44336;
      color: white;
      border-radius: 50%;
      min-width: 18px;
      height: 18px;
      font-size: 0.65rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .user-menu {
      position: relative;
    }

    .user-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.2s;
    }

    .user-btn:hover {
      background-color: #f5f5f5;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #e0e0e0;
      overflow: hidden;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.875rem;
      color: #333;
    }

    .user-role {
      font-size: 0.75rem;
      color: #666;
    }

    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      min-width: 200px;
      z-index: 1000;
      margin-top: 0.5rem;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      text-decoration: none;
      color: #333;
      transition: background-color 0.2s;
    }

    .dropdown-item:hover {
      background-color: #f5f5f5;
    }

    .dropdown-divider {
      margin: 0;
      border: none;
      border-top: 1px solid #e0e0e0;
    }

    .notifications-panel {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: flex;
      justify-content: flex-end;
      padding-top: 64px;
    }

    .notifications-content {
      background: white;
      width: 400px;
      height: 100%;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
    }

    .notifications-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .notifications-header h3 {
      margin: 0;
      color: #333;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      background-color: #f5f5f5;
    }

    .notifications-list {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }

    .notification-item {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      transition: background-color 0.2s;
    }

    .notification-item:hover {
      background-color: #f5f5f5;
    }

    .notification-item.unread {
      background-color: #e3f2fd;
    }

    .notification-icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #1976d2;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .notification-content {
      flex: 1;
    }

    .notification-title {
      font-weight: 600;
      font-size: 0.875rem;
      color: #333;
      margin-bottom: 0.25rem;
    }

    .notification-message {
      font-size: 0.75rem;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .notification-time {
      font-size: 0.65rem;
      color: #999;
    }

    .no-notifications {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 2rem;
    }

    .material-icons {
      font-size: 1.25rem;
    }
  `]
})
export class HeaderComponent implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();

  searchTerm: string = '';
  userMenuOpen: boolean = false;
  notificationsOpen: boolean = false;
  hasNotifications: boolean = true;
  notificationCount: number = 3;
  
  currentUser = {
    name: 'Dr. João Silva',
    role: 'Médico',
    foto: null
  };

  notifications = [
    {
      id: 1,
      type: 'plantao',
      title: 'Novo plantão disponível',
      message: 'Plantão de cardiologia para amanhã às 08:00',
      time: new Date(),
      read: false
    },
    {
      id: 2,
      type: 'troca',
      title: 'Solicitação de troca aceita',
      message: 'Sua troca foi aceita por Dr. Maria',
      time: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: 3,
      type: 'pagamento',
      title: 'Pagamento processado',
      message: 'Pagamento de R$ 2.500,00 foi processado',
      time: new Date(Date.now() - 7200000),
      read: true
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      console.log('Searching for:', this.searchTerm);
      // Implement search functionality
    }
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
    if (this.userMenuOpen) {
      this.notificationsOpen = false;
    }
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
    if (this.notificationsOpen) {
      this.userMenuOpen = false;
    }
  }

  toggleSettings(): void {
    this.router.navigate(['/usuario/settings']);
  }

  closeNotifications(): void {
    this.notificationsOpen = false;
  }

  goToProfile(): void {
    this.userMenuOpen = false;
    this.router.navigate(['/usuario/profile']);
  }

  goToSettings(): void {
    this.userMenuOpen = false;
    this.router.navigate(['/usuario/settings']);
  }

  logout(): void {
    this.userMenuOpen = false;
    // Implement logout logic
    this.router.navigate(['/auth/login']);
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'plantao': 'schedule',
      'troca': 'swap_horiz',
      'pagamento': 'payment',
      'sistema': 'info',
      'default': 'notifications'
    };
    return icons[type] || icons['default'];
  }
}

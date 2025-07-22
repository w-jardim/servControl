import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  badge?: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title" *ngIf="!collapsed">Geral</div>
          <ul class="nav-list">
            <li *ngFor="let item of menuItems" class="nav-item">
              <a 
                [routerLink]="item.route" 
                *ngIf="!item.children"
                class="nav-link"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{exact: true}"
                [title]="collapsed ? item.label : ''">
                <span class="material-icons nav-icon">{{ item.icon }}</span>
                <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
                <span class="nav-badge" *ngIf="item.badge && !collapsed">{{ item.badge }}</span>
              </a>

              <!-- Submenu -->
              <div *ngIf="item.children" class="nav-submenu">
                <button 
                  class="nav-link submenu-toggle"
                  [class.active]="isSubmenuActive(item)"
                  (click)="toggleSubmenu(item.id)"
                  [title]="collapsed ? item.label : ''">
                  <span class="material-icons nav-icon">{{ item.icon }}</span>
                  <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
                  <span class="nav-badge" *ngIf="item.badge && !collapsed">{{ item.badge }}</span>
                  <span class="material-icons submenu-arrow" *ngIf="!collapsed">
                    {{ activeSubmenus.has(item.id) ? 'expand_less' : 'expand_more' }}
                  </span>
                </button>

                <ul class="submenu-list" 
                    *ngIf="activeSubmenus.has(item.id) && !collapsed"
                    [@slideDown]>
                  <li *ngFor="let child of item.children" class="submenu-item">
                    <a 
                      [routerLink]="child.route"
                      class="submenu-link"
                      routerLinkActive="active">
                      <span class="material-icons submenu-icon">{{ child.icon }}</span>
                      <span class="submenu-label">{{ child.label }}</span>
                      <span class="nav-badge" *ngIf="child.badge">{{ child.badge }}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div class="nav-section" *ngIf="adminMenuItems.length > 0">
          <div class="nav-section-title" *ngIf="!collapsed">Administração</div>
          <ul class="nav-list">
            <li *ngFor="let item of adminMenuItems" class="nav-item">
              <a 
                [routerLink]="item.route"
                class="nav-link"
                routerLinkActive="active"
                [title]="collapsed ? item.label : ''">
                <span class="material-icons nav-icon">{{ item.icon }}</span>
                <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
                <span class="nav-badge" *ngIf="item.badge && !collapsed">{{ item.badge }}</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button class="toggle-btn" (click)="toggleSidebar()" [title]="collapsed ? 'Expandir menu' : 'Recolher menu'">
          <span class="material-icons">{{ collapsed ? 'chevron_right' : 'chevron_left' }}</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      background: #1e293b;
      color: white;
      width: 280px;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 64px;
      z-index: 50;
      transition: width 0.3s ease;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .sidebar.collapsed {
      width: 64px;
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 0;
    }

    .nav-section {
      margin-bottom: 1.5rem;
    }

    .nav-section-title {
      padding: 0 1.5rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.05em;
    }

    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-item {
      margin-bottom: 0.25rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      color: #cbd5e1;
      text-decoration: none;
      transition: all 0.2s ease;
      position: relative;
      border: none;
      background: none;
      width: 100%;
      cursor: pointer;
    }

    .nav-link:hover {
      background-color: #334155;
      color: white;
    }

    .nav-link.active {
      background-color: #1976d2;
      color: white;
    }

    .nav-link.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: #2196f3;
    }

    .nav-icon {
      font-size: 1.25rem;
      margin-right: 0.75rem;
      flex-shrink: 0;
    }

    .collapsed .nav-icon {
      margin-right: 0;
    }

    .nav-label {
      flex: 1;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .nav-badge {
      background-color: #ef4444;
      color: white;
      border-radius: 10px;
      padding: 0.125rem 0.375rem;
      font-size: 0.625rem;
      font-weight: 600;
      min-width: 18px;
      text-align: center;
    }

    .nav-submenu {
      position: relative;
    }

    .submenu-toggle {
      width: 100%;
      text-align: left;
    }

    .submenu-arrow {
      font-size: 1rem;
      margin-left: auto;
    }

    .submenu-list {
      list-style: none;
      margin: 0;
      padding: 0;
      background-color: #0f172a;
      overflow: hidden;
    }

    .submenu-item {
      margin: 0;
    }

    .submenu-link {
      display: flex;
      align-items: center;
      padding: 0.5rem 1.5rem 0.5rem 3.5rem;
      color: #94a3b8;
      text-decoration: none;
      transition: all 0.2s ease;
      font-size: 0.8rem;
    }

    .submenu-link:hover {
      background-color: #1e293b;
      color: white;
    }

    .submenu-link.active {
      background-color: #1976d2;
      color: white;
    }

    .submenu-icon {
      font-size: 1rem;
      margin-right: 0.75rem;
    }

    .submenu-label {
      flex: 1;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid #334155;
    }

    .toggle-btn {
      background: none;
      border: none;
      color: #cbd5e1;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      transition: background-color 0.2s ease;
    }

    .toggle-btn:hover {
      background-color: #334155;
      color: white;
    }

    .material-icons {
      font-size: inherit;
    }

    /* Animations */
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Scrollbar styling */
    .sidebar-nav::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar-nav::-webkit-scrollbar-track {
      background: #1e293b;
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background: #475569;
      border-radius: 2px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb:hover {
      background: #64748b;
    }
  `]
})
export class SidebarComponent implements OnInit {
  @Input() collapsed: boolean = false;

  activeSubmenus = new Set<string>();
  currentUserRole = 'admin'; // This should come from auth service

  menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      id: 'plantoes',
      label: 'Plantões',
      icon: 'schedule',
      children: [
        { id: 'plantoes-list', label: 'Listar Plantões', icon: 'list', route: '/plantao/list' },
        { id: 'plantoes-form', label: 'Novo Plantão', icon: 'add', route: '/plantao/form' },
        { id: 'plantoes-calendar', label: 'Calendário', icon: 'calendar_month', route: '/plantao/calendar' }
      ]
    },
    {
      id: 'trocas',
      label: 'Trocas',
      icon: 'swap_horiz',
      children: [
        { id: 'trocas-list', label: 'Minhas Trocas', icon: 'list', route: '/troca/list' },
        { id: 'trocas-form', label: 'Nova Troca', icon: 'add', route: '/troca/form', badge: '2' }
      ]
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      icon: 'payments',
      children: [
        { id: 'financeiro-list', label: 'Pagamentos', icon: 'payment', route: '/financeiro/list' },
        { id: 'financeiro-form', label: 'Novo Pagamento', icon: 'add', route: '/financeiro/form' }
      ]
    },
    {
      id: 'usuario',
      label: 'Perfil',
      icon: 'person',
      children: [
        { id: 'usuario-profile', label: 'Meu Perfil', icon: 'account_circle', route: '/usuario/profile' },
        { id: 'usuario-settings', label: 'Configurações', icon: 'settings', route: '/usuario/settings' }
      ]
    }
  ];

  adminMenuItems: MenuItem[] = [
    {
      id: 'usuarios',
      label: 'Usuários',
      icon: 'people',
      route: '/admin/usuarios',
      roles: ['admin']
    },
    {
      id: 'logs',
      label: 'Logs do Sistema',
      icon: 'history',
      route: '/logs/list',
      roles: ['admin']
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      icon: 'assessment',
      route: '/admin/relatorios',
      roles: ['admin', 'coordenador']
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Filter admin items based on user role
    this.adminMenuItems = this.adminMenuItems.filter(item => 
      !item.roles || item.roles.includes(this.currentUserRole)
    );

    // Auto-expand active submenu
    this.expandActiveSubmenu();
  }

  toggleSubmenu(itemId: string): void {
    if (this.activeSubmenus.has(itemId)) {
      this.activeSubmenus.delete(itemId);
    } else {
      this.activeSubmenus.add(itemId);
    }
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
    if (this.collapsed) {
      this.activeSubmenus.clear();
    }
  }

  isSubmenuActive(item: MenuItem): boolean {
    if (!item.children) return false;
    
    return item.children.some(child => 
      child.route && this.router.url.startsWith(child.route)
    );
  }

  private expandActiveSubmenu(): void {
    this.menuItems.forEach(item => {
      if (this.isSubmenuActive(item)) {
        this.activeSubmenus.add(item.id);
      }
    });
  }
}

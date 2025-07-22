import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  template: `
    <div class="layout">
      <app-header (menuToggle)="toggleSidebar()"></app-header>
      
      <div class="layout-body">
        <app-sidebar [collapsed]="sidebarCollapsed"></app-sidebar>
        
        <main class="main-content" [class.expanded]="sidebarCollapsed">
          <div class="content-wrapper">
            <router-outlet></router-outlet>
          </div>
          <app-footer></app-footer>
        </main>
      </div>

      <!-- Mobile overlay -->
      <div class="mobile-overlay" 
           *ngIf="showMobileOverlay" 
           (click)="closeMobileSidebar()"></div>
    </div>
  `,
  styles: [`
    .layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f8fafc;
    }

    .layout-body {
      display: flex;
      flex: 1;
      position: relative;
    }

    .main-content {
      flex: 1;
      margin-left: 280px;
      transition: margin-left 0.3s ease;
      display: flex;
      flex-direction: column;
      min-height: calc(100vh - 64px);
    }

    .main-content.expanded {
      margin-left: 64px;
    }

    .content-wrapper {
      flex: 1;
      padding: 1.5rem;
      overflow-x: auto;
    }

    .mobile-overlay {
      position: fixed;
      top: 64px;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 40;
      display: none;
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
      }

      .main-content.expanded {
        margin-left: 0;
      }

      .content-wrapper {
        padding: 1rem;
      }

      .mobile-overlay {
        display: block;
      }

      :host ::ng-deep app-sidebar {
        position: fixed;
        z-index: 50;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      :host ::ng-deep app-sidebar.mobile-open {
        transform: translateX(0);
      }
    }

    @media (max-width: 480px) {
      .content-wrapper {
        padding: 0.75rem;
      }
    }
  `]
})
export class LayoutComponent implements OnInit {
  sidebarCollapsed = false;
  showMobileOverlay = false;
  isMobile = false;

  constructor() {}

  ngOnInit(): void {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  toggleSidebar(): void {
    if (this.isMobile) {
      this.showMobileOverlay = !this.showMobileOverlay;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }

  closeMobileSidebar(): void {
    this.showMobileOverlay = false;
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.showMobileOverlay = false;
    }
  }
}

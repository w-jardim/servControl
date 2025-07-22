import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

export interface Notification {
  id?: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
}

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="snackbar-container">
      <div *ngFor="let notification of notifications; trackBy: trackByFn"
           class="snackbar"
           [class]="'snackbar-' + notification.type"
           [@slideIn]>
        <div class="snackbar-content">
          <div class="snackbar-icon">
            <span class="material-icons">{{ getIcon(notification.type) }}</span>
          </div>
          <div class="snackbar-text">
            <div class="snackbar-title">{{ notification.title }}</div>
            <div class="snackbar-message">{{ notification.message }}</div>
          </div>
          <div class="snackbar-actions">
            <button *ngIf="notification.action" 
                    class="action-btn"
                    (click)="onActionClick(notification)">
              {{ notification.action.label }}
            </button>
            <button class="close-btn" (click)="dismiss(notification)">
              <span class="material-icons">close</span>
            </button>
          </div>
        </div>
        <div class="progress-bar" 
             [style.animation-duration]="notification.duration + 'ms'"></div>
      </div>
    </div>
  `,
  styles: [`
    .snackbar-container {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 400px;
    }

    .snackbar {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      position: relative;
      transform: translateX(100%);
      transition: transform 0.3s ease-in-out;
    }

    .snackbar.show {
      transform: translateX(0);
    }

    .snackbar-content {
      display: flex;
      align-items: flex-start;
      padding: 1rem;
      gap: 0.75rem;
    }

    .snackbar-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .snackbar-text {
      flex: 1;
    }

    .snackbar-title {
      font-weight: 600;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
      color: #333;
    }

    .snackbar-message {
      font-size: 0.75rem;
      color: #666;
      line-height: 1.4;
    }

    .snackbar-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .action-btn {
      background: none;
      border: none;
      color: inherit;
      font-weight: 600;
      font-size: 0.75rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
      transition: background-color 0.2s;
    }

    .action-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
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
      color: inherit;
      opacity: 0.7;
    }

    .close-btn:hover {
      opacity: 1;
      background-color: rgba(255, 255, 255, 0.1);
    }

    .progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      animation: progress linear forwards;
    }

    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }

    /* Notification types */
    .snackbar-success {
      background-color: #4caf50;
      color: white;
    }

    .snackbar-error {
      background-color: #f44336;
      color: white;
    }

    .snackbar-warning {
      background-color: #ff9800;
      color: white;
    }

    .snackbar-info {
      background-color: #2196f3;
      color: white;
    }

    .material-icons {
      font-size: 1rem;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class SnackbarComponent implements OnInit, OnDestroy {
  @Input() notifications: Notification[] = [];
  private subscription?: Subscription;

  constructor() {}

  ngOnInit(): void {
    // Subscribe to notification service when integrated
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  show(notification: Notification): void {
    this.notifications.push(notification);

    // Auto dismiss after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.dismiss(notification);
      }, notification.duration);
    }
  }

  dismiss(notification: Notification): void {
    const index = this.notifications.findIndex(n => n.id === notification.id);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  onActionClick(notification: Notification): void {
    if (notification.action) {
      notification.action.callback();
      this.dismiss(notification);
    }
  }

  getIcon(type: string): string {
    const icons = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };
    return icons[type as keyof typeof icons] || 'info';
  }

  trackByFn(index: number, item: Notification): string {
    return item.id || index.toString();
  }
}

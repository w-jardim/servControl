import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DialogData {
  title: string;
  message: string;
  type?: 'confirm' | 'alert' | 'custom';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-overlay" (click)="onOverlayClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3 class="dialog-title">{{ data.title }}</h3>
          <button class="close-btn" (click)="onClose()">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <div class="dialog-content">
          <p class="dialog-message">{{ data.message }}</p>
          <ng-content></ng-content>
        </div>
        
        <div class="dialog-actions">
          <button *ngIf="data.showCancel !== false" 
                  class="btn btn-secondary" 
                  (click)="onCancel()">
            {{ data.cancelText || 'Cancelar' }}
          </button>
          <button class="btn btn-primary" 
                  (click)="onConfirm()">
            {{ data.confirmText || 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
      background-color: #f5f5f5;
    }

    .dialog-title {
      margin: 0;
      color: #333;
      font-size: 1.125rem;
      font-weight: 600;
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
      color: #666;
    }

    .close-btn:hover {
      background-color: #e0e0e0;
      color: #333;
    }

    .dialog-content {
      padding: 1rem;
      flex: 1;
      overflow-y: auto;
    }

    .dialog-message {
      margin: 0 0 1rem 0;
      color: #555;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      padding: 1rem;
      border-top: 1px solid #e0e0e0;
      background-color: #fafafa;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-primary:hover {
      background-color: #1565c0;
    }

    .btn-secondary {
      background-color: #757575;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #616161;
    }

    .material-icons {
      font-size: 1.125rem;
    }
  `]
})
export class DialogComponent implements OnInit {
  data: DialogData = {
    title: '',
    message: '',
    type: 'alert'
  };

  constructor(@Inject('dialogData') data: DialogData) {
    this.data = { ...this.data, ...data };
  }

  ngOnInit(): void {}

  onConfirm(): void {
    // Emit confirm event or close with result
    this.onClose(true);
  }

  onCancel(): void {
    this.onClose(false);
  }

  onClose(result?: boolean): void {
    // This would typically close the dialog through a service
    console.log('Dialog closed with result:', result);
  }

  onOverlayClick(event: Event): void {
    // Close dialog when clicking outside
    this.onClose(false);
  }
}

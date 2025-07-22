import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type"
      [disabled]="disabled || loading"
      [class]="getButtonClasses()"
      (click)="onClick($event)">
      
      <span *ngIf="loading" class="loading-spinner"></span>
      <span *ngIf="icon && !loading" class="material-icons button-icon">{{ icon }}</span>
      <span class="button-text" [class.hidden]="loading && !text">
        <ng-content>{{ text }}</ng-content>
      </span>
      <span *ngIf="badge" class="button-badge">{{ badge }}</span>
    </button>
  `,
  styles: [`
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      position: relative;
      text-decoration: none;
      min-height: 36px;
      user-select: none;
    }

    .button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    /* Button variants */
    .button-primary {
      background-color: #1976d2;
      color: white;
    }

    .button-primary:hover:not(:disabled) {
      background-color: #1565c0;
    }

    .button-secondary {
      background-color: #757575;
      color: white;
    }

    .button-secondary:hover:not(:disabled) {
      background-color: #616161;
    }

    .button-success {
      background-color: #4caf50;
      color: white;
    }

    .button-success:hover:not(:disabled) {
      background-color: #43a047;
    }

    .button-warning {
      background-color: #ff9800;
      color: white;
    }

    .button-warning:hover:not(:disabled) {
      background-color: #f57c00;
    }

    .button-danger {
      background-color: #f44336;
      color: white;
    }

    .button-danger:hover:not(:disabled) {
      background-color: #d32f2f;
    }

    .button-outline {
      background-color: transparent;
      border: 1px solid #ddd;
      color: #333;
    }

    .button-outline:hover:not(:disabled) {
      background-color: #f5f5f5;
    }

    .button-text {
      background-color: transparent;
      color: #1976d2;
    }

    .button-text:hover:not(:disabled) {
      background-color: rgba(25, 118, 210, 0.04);
    }

    /* Button sizes */
    .button-small {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      min-height: 28px;
    }

    .button-large {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      min-height: 44px;
    }

    .button-full-width {
      width: 100%;
    }

    /* Button states */
    .button-round {
      border-radius: 50px;
    }

    .button-square {
      border-radius: 0;
    }

    .button-icon-only {
      padding: 0.5rem;
      min-width: 36px;
    }

    /* Loading spinner */
    .loading-spinner {
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

    .button-icon {
      font-size: 1rem;
    }

    .button-text.hidden {
      opacity: 0;
    }

    .button-badge {
      position: absolute;
      top: -6px;
      right: -6px;
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

    .material-icons {
      font-size: inherit;
    }
  `]
})
export class ButtonComponent implements OnInit {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'text' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() round: boolean = false;
  @Input() square: boolean = false;
  @Input() icon?: string;
  @Input() iconOnly: boolean = false;
  @Input() text?: string;
  @Input() badge?: string | number;

  @Output() click = new EventEmitter<Event>();

  ngOnInit(): void {}

  onClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.click.emit(event);
    }
  }

  getButtonClasses(): string {
    const classes = ['button'];
    
    classes.push(`button-${this.variant}`);
    
    if (this.size !== 'medium') {
      classes.push(`button-${this.size}`);
    }
    
    if (this.fullWidth) {
      classes.push('button-full-width');
    }
    
    if (this.round) {
      classes.push('button-round');
    }
    
    if (this.square) {
      classes.push('button-square');
    }
    
    if (this.iconOnly) {
      classes.push('button-icon-only');
    }
    
    return classes.join(' ');
  }
}

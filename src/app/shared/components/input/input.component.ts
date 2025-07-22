import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="input-container" [class]="getContainerClasses()">
      <label *ngIf="label" [for]="inputId" class="input-label">
        {{ label }}
        <span *ngIf="required" class="required-asterisk">*</span>
      </label>
      
      <div class="input-wrapper">
        <span *ngIf="prefixIcon" class="material-icons input-prefix-icon">{{ prefixIcon }}</span>
        
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [value]="value"
          [class]="getInputClasses()"
          (input)="onInput($event)"
          (blur)="onBlur($event)"
          (focus)="onFocus($event)"
          (keyup.enter)="onEnter($event)"
          #inputElement
        />
        
        <span *ngIf="suffixIcon" class="material-icons input-suffix-icon">{{ suffixIcon }}</span>
        
        <button *ngIf="clearable && value" 
                type="button"
                class="clear-button"
                (click)="onClear()">
          <span class="material-icons">clear</span>
        </button>
      </div>
      
      <div *ngIf="hint || errorMessage" class="input-helper">
        <span *ngIf="errorMessage" class="error-message">{{ errorMessage }}</span>
        <span *ngIf="hint && !errorMessage" class="hint-message">{{ hint }}</span>
      </div>
    </div>
  `,
  styles: [`
    .input-container {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      width: 100%;
    }

    .input-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #333;
      margin-bottom: 0.25rem;
    }

    .required-asterisk {
      color: #f44336;
      margin-left: 0.25rem;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      background-color: white;
    }

    .input:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
    }

    .input:disabled {
      background-color: #f5f5f5;
      color: #999;
      cursor: not-allowed;
    }

    .input:readonly {
      background-color: #f9f9f9;
    }

    .input-prefix-icon,
    .input-suffix-icon {
      position: absolute;
      color: #666;
      font-size: 1.25rem;
      z-index: 1;
    }

    .input-prefix-icon {
      left: 0.75rem;
    }

    .input-suffix-icon {
      right: 0.75rem;
    }

    .input-with-prefix {
      padding-left: 2.5rem;
    }

    .input-with-suffix {
      padding-right: 2.5rem;
    }

    .input-with-clear {
      padding-right: 2.5rem;
    }

    .clear-button {
      position: absolute;
      right: 0.5rem;
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

    .clear-button:hover {
      background-color: #f0f0f0;
    }

    .clear-button .material-icons {
      font-size: 1rem;
    }

    /* Input sizes */
    .input-small .input {
      padding: 0.5rem;
      font-size: 0.75rem;
    }

    .input-large .input {
      padding: 1rem;
      font-size: 1rem;
    }

    /* Input variants */
    .input-error .input {
      border-color: #f44336;
    }

    .input-error .input:focus {
      border-color: #f44336;
      box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.1);
    }

    .input-success .input {
      border-color: #4caf50;
    }

    .input-success .input:focus {
      border-color: #4caf50;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
    }

    /* Helper text */
    .input-helper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 1rem;
    }

    .error-message {
      color: #f44336;
      font-size: 0.75rem;
    }

    .hint-message {
      color: #666;
      font-size: 0.75rem;
    }

    .material-icons {
      font-size: inherit;
    }
  `]
})
export class InputComponent implements OnInit, ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() type: string = 'text';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() clearable: boolean = false;
  @Input() prefixIcon?: string;
  @Input() suffixIcon?: string;
  @Input() hint?: string;
  @Input() errorMessage?: string;
  @Input() inputId?: string;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<Event>();
  @Output() focus = new EventEmitter<Event>();
  @Output() enter = new EventEmitter<Event>();

  value: string = '';
  private onChange = (value: string) => {};
  private onTouched = () => {};

  ngOnInit(): void {
    if (!this.inputId) {
      this.inputId = 'input-' + Math.random().toString(36).substr(2, 9);
    }
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onBlur(event: Event): void {
    this.onTouched();
    this.blur.emit(event);
  }

  onFocus(event: Event): void {
    this.focus.emit(event);
  }

  onEnter(event: Event): void {
    this.enter.emit(event);
  }

  onClear(): void {
    this.value = '';
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  getContainerClasses(): string {
    const classes = ['input-container'];
    
    classes.push(`input-${this.size}`);
    
    if (this.errorMessage) {
      classes.push('input-error');
    }
    
    return classes.join(' ');
  }

  getInputClasses(): string {
    const classes = ['input'];
    
    if (this.prefixIcon) {
      classes.push('input-with-prefix');
    }
    
    if (this.suffixIcon || this.clearable) {
      classes.push('input-with-suffix');
    }
    
    if (this.clearable && this.value) {
      classes.push('input-with-clear');
    }
    
    return classes.join(' ');
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

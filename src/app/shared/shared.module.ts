import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { TableComponent } from './components/table/table.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { ButtonComponent } from './components/button/button.component';
import { InputComponent } from './components/input/input.component';

// Pipes
import { DatePipe } from './pipes/date.pipe';
import { CurrencyPipe, PercentagePipe, NumberPipe } from './pipes/currency.pipe';
import { StatusPipe, PriorityPipe, RolePipe, SpecialtyPipe } from './pipes/status.pipe';

// Directives
import { 
  OnlyNumberDirective, 
  OnlyDecimalDirective, 
  PhoneMaskDirective, 
  CpfMaskDirective, 
  CnpjMaskDirective 
} from './directives/only-number.directive';

const COMPONENTS = [
  TableComponent,
  DialogComponent,
  SnackbarComponent,
  ButtonComponent,
  InputComponent
];

const PIPES = [
  DatePipe,
  CurrencyPipe,
  PercentagePipe,
  NumberPipe,
  StatusPipe,
  PriorityPipe,
  RolePipe,
  SpecialtyPipe
];

const DIRECTIVES = [
  OnlyNumberDirective,
  OnlyDecimalDirective,
  PhoneMaskDirective,
  CpfMaskDirective,
  CnpjMaskDirective
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...COMPONENTS,
    ...PIPES,
    ...DIRECTIVES
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...COMPONENTS,
    ...PIPES,
    ...DIRECTIVES
  ]
})
export class SharedModule { }

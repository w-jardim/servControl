import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'currency' | 'status' | 'actions';
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableAction {
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'warn' | 'accent';
  action: (item: any) => void;
  visible?: (item: any) => boolean;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="table-container">
      <div class="table-header" *ngIf="title || searchable">
        <h3 *ngIf="title">{{ title }}</h3>
        <div class="table-actions">
          <div class="search-container" *ngIf="searchable">
            <input 
              type="text" 
              placeholder="Buscar..." 
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              class="search-input">
          </div>
          <ng-content select="[slot=actions]"></ng-content>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th *ngFor="let column of columns" 
                  [style.width]="column.width"
                  [style.text-align]="column.align || 'left'"
                  [class.sortable]="column.sortable"
                  (click)="onSort(column)">
                {{ column.label }}
                <span *ngIf="column.sortable && sortColumn === column.key" 
                      class="sort-indicator">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of paginatedData; trackBy: trackByFn" 
                [class.selectable]="selectable"
                (click)="onRowClick(item)">
              <td *ngFor="let column of columns"
                  [style.text-align]="column.align || 'left'">
                <ng-container [ngSwitch]="column.type">
                  <!-- Text (default) -->
                  <span *ngSwitchDefault>{{ getNestedProperty(item, column.key) }}</span>
                  
                  <!-- Date -->
                  <span *ngSwitchCase="'date'">
                    {{ getNestedProperty(item, column.key) | date:'dd/MM/yyyy HH:mm' }}
                  </span>
                  
                  <!-- Currency -->
                  <span *ngSwitchCase="'currency'">
                    {{ getNestedProperty(item, column.key) | currency:'BRL':'symbol':'1.2-2' }}
                  </span>
                  
                  <!-- Status -->
                  <span *ngSwitchCase="'status'" 
                        class="status-badge"
                        [class]="'status-' + getNestedProperty(item, column.key)">
                    {{ getStatusLabel(getNestedProperty(item, column.key)) }}
                  </span>
                  
                  <!-- Actions -->
                  <div *ngSwitchCase="'actions'" class="actions-cell">
                    <ng-container *ngFor="let action of actions">
                      <button *ngIf="!action.visible || action.visible(item)"
                              class="action-btn"
                              [class]="'btn-' + (action.color || 'primary')"
                              (click)="$event.stopPropagation(); action.action(item)"
                              [title]="action.label">
                        <span *ngIf="action.icon" class="material-icons">{{ action.icon }}</span>
                        <span *ngIf="!action.icon">{{ action.label }}</span>
                      </button>
                    </ng-container>
                  </div>
                </ng-container>
              </td>
            </tr>
            
            <tr *ngIf="paginatedData.length === 0" class="no-data">
              <td [attr.colspan]="columns.length" class="text-center">
                {{ noDataMessage || 'Nenhum registro encontrado' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-container" *ngIf="data.length > pageSize">
        <div class="pagination-info">
          Mostrando {{ (currentPage - 1) * pageSize + 1 }} a 
          {{ Math.min(currentPage * pageSize, data.length) }} de 
          {{ data.length }} registros
        </div>
        <div class="pagination-controls">
          <button (click)="goToPage(1)" [disabled]="currentPage === 1">
            Primeira
          </button>
          <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1">
            Anterior
          </button>
          
          <span class="page-numbers">
            <button *ngFor="let page of getVisiblePages()"
                    (click)="goToPage(page)"
                    [class.active]="page === currentPage">
              {{ page }}
            </button>
          </span>
          
          <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages">
            Próxima
          </button>
          <button (click)="goToPage(totalPages)" [disabled]="currentPage === totalPages">
            Última
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .table-header h3 {
      margin: 0;
      color: #333;
    }

    .table-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .search-input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      min-width: 200px;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th,
    .data-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    .data-table th {
      background-color: #f5f5f5;
      font-weight: 600;
      color: #333;
    }

    .data-table th.sortable {
      cursor: pointer;
      user-select: none;
    }

    .data-table th.sortable:hover {
      background-color: #eeeeee;
    }

    .sort-indicator {
      margin-left: 0.5rem;
      color: #666;
    }

    .data-table tr.selectable {
      cursor: pointer;
    }

    .data-table tr.selectable:hover {
      background-color: #f9f9f9;
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-ativo { background-color: #e8f5e8; color: #2e7d32; }
    .status-inativo { background-color: #ffeaa7; color: #d68910; }
    .status-pendente { background-color: #fff3cd; color: #856404; }
    .status-aprovado { background-color: #d4edda; color: #155724; }
    .status-rejeitado { background-color: #f8d7da; color: #721c24; }
    .status-cancelado { background-color: #f8d7da; color: #721c24; }
    .status-concluido { background-color: #d1ecf1; color: #0c5460; }
    .status-pago { background-color: #d4edda; color: #155724; }

    .actions-cell {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      padding: 0.25rem 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.75rem;
      transition: background-color 0.2s;
    }

    .btn-primary { background-color: #1976d2; color: white; }
    .btn-primary:hover { background-color: #1565c0; }
    .btn-secondary { background-color: #757575; color: white; }
    .btn-secondary:hover { background-color: #616161; }
    .btn-warn { background-color: #d32f2f; color: white; }
    .btn-warn:hover { background-color: #c62828; }
    .btn-accent { background-color: #7b1fa2; color: white; }
    .btn-accent:hover { background-color: #6a1b9a; }

    .no-data {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 2rem;
    }

    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-top: 1px solid #e0e0e0;
      background-color: #fafafa;
    }

    .pagination-info {
      color: #666;
      font-size: 0.875rem;
    }

    .pagination-controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .pagination-controls button {
      padding: 0.5rem 0.75rem;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .pagination-controls button:hover:not(:disabled) {
      background-color: #f5f5f5;
    }

    .pagination-controls button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .pagination-controls button.active {
      background-color: #1976d2;
      color: white;
      border-color: #1976d2;
    }

    .page-numbers {
      display: flex;
      gap: 0.25rem;
    }

    .text-center {
      text-align: center;
    }
  `]
})
export class TableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() title?: string;
  @Input() searchable: boolean = true;
  @Input() selectable: boolean = false;
  @Input() pageSize: number = 10;
  @Input() noDataMessage?: string;

  @Output() rowClick = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();

  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  filteredData: any[] = [];
  paginatedData: any[] = [];

  ngOnInit(): void {
    this.filteredData = [...this.data];
    this.updatePaginatedData();
  }

  ngOnChanges(): void {
    this.filteredData = [...this.data];
    this.updatePaginatedData();
  }

  onSearch(): void {
    if (this.searchTerm) {
      this.filteredData = this.data.filter(item =>
        this.columns.some(column =>
          this.getNestedProperty(item, column.key)
            ?.toString()
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        )
      );
    } else {
      this.filteredData = [...this.data];
    }
    
    this.currentPage = 1;
    this.updatePaginatedData();
    this.search.emit(this.searchTerm);
  }

  onSort(column: TableColumn): void {
    if (!column.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a, b) => {
      const valueA = this.getNestedProperty(a, column.key);
      const valueB = this.getNestedProperty(b, column.key);

      let comparison = 0;
      if (valueA > valueB) comparison = 1;
      if (valueA < valueB) comparison = -1;

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.updatePaginatedData();
  }

  onRowClick(item: any): void {
    if (this.selectable) {
      this.rowClick.emit(item);
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedData();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  getVisiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, -1);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < total - 1) {
      rangeWithDots.push(-1, total);
    } else {
      rangeWithDots.push(total);
    }

    return rangeWithDots.filter(x => x !== -1);
  }

  private updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'ativo': 'Ativo',
      'inativo': 'Inativo',
      'pendente': 'Pendente',
      'aprovado': 'Aprovado',
      'rejeitado': 'Rejeitado',
      'cancelado': 'Cancelado',
      'concluido': 'Concluído',
      'pago': 'Pago'
    };
    return statusLabels[status] || status;
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  Math = Math;
}

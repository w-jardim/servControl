import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pagamento {
  id: string;
  plantaoId: string;
  medico: string;
  valor: number;
  dataPagamento: Date;
  formaPagamento: 'dinheiro' | 'pix' | 'transferencia' | 'cartao';
  status: 'pendente' | 'pago' | 'cancelado';
  observacoes?: string;
}

export interface RelatorioFinanceiro {
  periodo: {
    inicio: Date;
    fim: Date;
  };
  totalPago: number;
  totalPendente: number;
  totalCancelado: number;
  pagamentosPorMedico: Array<{
    medico: string;
    totalPago: number;
    totalPendente: number;
    quantidadePlantoes: number;
  }>;
  pagamentosPorFormaPagamento: Array<{
    formaPagamento: string;
    total: number;
    quantidade: number;
  }>;
}

export interface FinanceiroFilters {
  medico?: string;
  status?: string;
  formaPagamento?: string;
  dataInicio?: Date;
  dataFim?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {
  private readonly API_URL = 'http://localhost:3000/api/financeiro';

  constructor(private http: HttpClient) {}

  getPagamentos(filters?: FinanceiroFilters): Observable<Pagamento[]> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<Pagamento[]>(this.API_URL, { params });
  }

  getPagamentoById(id: string): Observable<Pagamento> {
    return this.http.get<Pagamento>(`${this.API_URL}/${id}`);
  }

  criarPagamento(pagamento: Omit<Pagamento, 'id'>): Observable<Pagamento> {
    return this.http.post<Pagamento>(this.API_URL, pagamento);
  }

  atualizarPagamento(id: string, pagamento: Partial<Pagamento>): Observable<Pagamento> {
    return this.http.put<Pagamento>(`${this.API_URL}/${id}`, pagamento);
  }

  efetuarPagamento(id: string, dadosPagamento: any): Observable<Pagamento> {
    return this.http.patch<Pagamento>(`${this.API_URL}/${id}/efetuar`, dadosPagamento);
  }

  cancelarPagamento(id: string, motivo: string): Observable<Pagamento> {
    return this.http.patch<Pagamento>(`${this.API_URL}/${id}/cancelar`, { motivo });
  }

  getPagamentosPorMedico(medicoId: string): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(`${this.API_URL}/medico/${medicoId}`);
  }

  getRelatorioFinanceiro(dataInicio: Date, dataFim: Date): Observable<RelatorioFinanceiro> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio.toISOString())
      .set('dataFim', dataFim.toISOString());
    
    return this.http.get<RelatorioFinanceiro>(`${this.API_URL}/relatorio`, { params });
  }

  getPagamentosPendentes(): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(`${this.API_URL}/pendentes`);
  }

  exportarRelatorio(dataInicio: Date, dataFim: Date, formato: 'pdf' | 'excel'): Observable<Blob> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio.toISOString())
      .set('dataFim', dataFim.toISOString())
      .set('formato', formato);
    
    return this.http.get(`${this.API_URL}/relatorio/exportar`, { 
      params, 
      responseType: 'blob' 
    });
  }
}

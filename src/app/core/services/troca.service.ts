import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SolicitacaoTroca {
  id: string;
  plantaoOrigemId: string;
  plantaoDestinoId: string;
  medicoSolicitante: string;
  medicoDestino: string;
  motivo: string;
  status: 'pendente' | 'aceita' | 'rejeitada' | 'cancelada';
  dataSolicitacao: Date;
  dataResposta?: Date;
  observacoes?: string;
}

export interface TrocaFilters {
  medicoSolicitante?: string;
  medicoDestino?: string;
  status?: string;
  dataSolicitacao?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TrocaService {
  private readonly API_URL = 'http://localhost:3000/api/trocas';

  constructor(private http: HttpClient) {}

  getTrocas(filters?: TrocaFilters): Observable<SolicitacaoTroca[]> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<SolicitacaoTroca[]>(this.API_URL, { params });
  }

  getTrocaById(id: string): Observable<SolicitacaoTroca> {
    return this.http.get<SolicitacaoTroca>(`${this.API_URL}/${id}`);
  }

  solicitarTroca(troca: Omit<SolicitacaoTroca, 'id' | 'status' | 'dataSolicitacao'>): Observable<SolicitacaoTroca> {
    return this.http.post<SolicitacaoTroca>(this.API_URL, troca);
  }

  aceitarTroca(id: string, observacoes?: string): Observable<SolicitacaoTroca> {
    return this.http.patch<SolicitacaoTroca>(`${this.API_URL}/${id}/aceitar`, { observacoes });
  }

  rejeitarTroca(id: string, motivo: string): Observable<SolicitacaoTroca> {
    return this.http.patch<SolicitacaoTroca>(`${this.API_URL}/${id}/rejeitar`, { motivo });
  }

  cancelarTroca(id: string): Observable<SolicitacaoTroca> {
    return this.http.patch<SolicitacaoTroca>(`${this.API_URL}/${id}/cancelar`, {});
  }

  getTrocasPorMedico(medicoId: string): Observable<SolicitacaoTroca[]> {
    return this.http.get<SolicitacaoTroca[]>(`${this.API_URL}/medico/${medicoId}`);
  }

  getTrocasPendentes(): Observable<SolicitacaoTroca[]> {
    return this.http.get<SolicitacaoTroca[]>(`${this.API_URL}/pendentes`);
  }

  getHistoricoTrocas(medicoId: string): Observable<SolicitacaoTroca[]> {
    return this.http.get<SolicitacaoTroca[]>(`${this.API_URL}/historico/${medicoId}`);
  }
}

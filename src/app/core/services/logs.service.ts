import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LogEntry {
  id: string;
  userId: string;
  userName: string;
  acao: string;
  modulo: 'plantao' | 'troca' | 'financeiro' | 'usuario' | 'auth' | 'sistema';
  detalhes: string;
  ip: string;
  userAgent: string;
  timestamp: Date;
  nivel: 'info' | 'warning' | 'error' | 'debug';
}

export interface LogFilters {
  userId?: string;
  acao?: string;
  modulo?: string;
  nivel?: string;
  dataInicio?: Date;
  dataFim?: Date;
  ip?: string;
}

export interface LogSummary {
  totalLogs: number;
  logsPorNivel: Array<{
    nivel: string;
    quantidade: number;
  }>;
  logsPorModulo: Array<{
    modulo: string;
    quantidade: number;
  }>;
  usuariosMaisAtivos: Array<{
    userId: string;
    userName: string;
    quantidade: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private readonly API_URL = 'http://localhost:3000/api/logs';

  constructor(private http: HttpClient) {}

  getLogs(filters?: LogFilters, page: number = 1, limit: number = 50): Observable<{
    logs: LogEntry[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<{
      logs: LogEntry[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(this.API_URL, { params });
  }

  getLogById(id: string): Observable<LogEntry> {
    return this.http.get<LogEntry>(`${this.API_URL}/${id}`);
  }

  criarLog(log: Omit<LogEntry, 'id' | 'timestamp'>): Observable<LogEntry> {
    return this.http.post<LogEntry>(this.API_URL, log);
  }

  getLogsPorUsuario(userId: string): Observable<LogEntry[]> {
    return this.http.get<LogEntry[]>(`${this.API_URL}/usuario/${userId}`);
  }

  getLogsPorModulo(modulo: string): Observable<LogEntry[]> {
    return this.http.get<LogEntry[]>(`${this.API_URL}/modulo/${modulo}`);
  }

  getLogsSummary(dataInicio: Date, dataFim: Date): Observable<LogSummary> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio.toISOString())
      .set('dataFim', dataFim.toISOString());
    
    return this.http.get<LogSummary>(`${this.API_URL}/summary`, { params });
  }

  exportarLogs(filters?: LogFilters, formato: 'csv' | 'json' = 'csv'): Observable<Blob> {
    let params = new HttpParams().set('formato', formato);
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get(`${this.API_URL}/exportar`, { 
      params, 
      responseType: 'blob' 
    });
  }

  limparLogsAntigos(diasParaManter: number): Observable<{ deletedCount: number }> {
    return this.http.delete<{ deletedCount: number }>(`${this.API_URL}/limpar/${diasParaManter}`);
  }

  // Métodos de conveniência para registrar logs específicos
  logInfo(acao: string, modulo: LogEntry['modulo'], detalhes: string): Observable<LogEntry> {
    return this.criarLog({
      userId: '', // será preenchido pelo backend
      userName: '', // será preenchido pelo backend
      acao,
      modulo,
      detalhes,
      ip: '', // será preenchido pelo backend
      userAgent: navigator.userAgent,
      nivel: 'info'
    });
  }

  logWarning(acao: string, modulo: LogEntry['modulo'], detalhes: string): Observable<LogEntry> {
    return this.criarLog({
      userId: '',
      userName: '',
      acao,
      modulo,
      detalhes,
      ip: '',
      userAgent: navigator.userAgent,
      nivel: 'warning'
    });
  }

  logError(acao: string, modulo: LogEntry['modulo'], detalhes: string): Observable<LogEntry> {
    return this.criarLog({
      userId: '',
      userName: '',
      acao,
      modulo,
      detalhes,
      ip: '',
      userAgent: navigator.userAgent,
      nivel: 'error'
    });
  }
}

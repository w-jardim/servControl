import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Plantao {
  id: string;
  medico: string;
  especialidade: string;
  dataInicio: Date;
  dataFim: Date;
  hospital: string;
  valor: number;
  status: 'ativo' | 'cancelado' | 'concluido';
  observacoes?: string;
}

export interface PlantaoFilters {
  medico?: string;
  especialidade?: string;
  hospital?: string;
  dataInicio?: Date;
  dataFim?: Date;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlantaoService {
  private readonly API_URL = 'http://localhost:3000/api/plantoes';

  constructor(private http: HttpClient) {}

  getPlantoes(filters?: PlantaoFilters): Observable<Plantao[]> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<Plantao[]>(this.API_URL, { params });
  }

  getPlantaoById(id: string): Observable<Plantao> {
    return this.http.get<Plantao>(`${this.API_URL}/${id}`);
  }

  createPlantao(plantao: Omit<Plantao, 'id'>): Observable<Plantao> {
    return this.http.post<Plantao>(this.API_URL, plantao);
  }

  updatePlantao(id: string, plantao: Partial<Plantao>): Observable<Plantao> {
    return this.http.put<Plantao>(`${this.API_URL}/${id}`, plantao);
  }

  deletePlantao(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getPlantoesByMedico(medicoId: string): Observable<Plantao[]> {
    return this.http.get<Plantao[]>(`${this.API_URL}/medico/${medicoId}`);
  }

  getPlantoesByPeriodo(dataInicio: Date, dataFim: Date): Observable<Plantao[]> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio.toISOString())
      .set('dataFim', dataFim.toISOString());
    
    return this.http.get<Plantao[]>(`${this.API_URL}/periodo`, { params });
  }

  cancelarPlantao(id: string, motivo: string): Observable<Plantao> {
    return this.http.patch<Plantao>(`${this.API_URL}/${id}/cancelar`, { motivo });
  }

  concluirPlantao(id: string): Observable<Plantao> {
    return this.http.patch<Plantao>(`${this.API_URL}/${id}/concluir`, {});
  }
}

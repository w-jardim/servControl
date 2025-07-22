import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: string;
  name: string;
  email: string;
  crm: string;
  especialidade: string;
  telefone: string;
  role: 'admin' | 'medico' | 'coordenador';
  status: 'ativo' | 'inativo' | 'bloqueado';
  dataCriacao: Date;
  ultimoLogin?: Date;
  foto?: string;
}

export interface UsuarioFilters {
  name?: string;
  email?: string;
  especialidade?: string;
  role?: string;
  status?: string;
}

export interface PerfilUsuario {
  id: string;
  name: string;
  email: string;
  crm: string;
  especialidade: string;
  telefone: string;
  foto?: string;
  preferencias: {
    notificacoes: boolean;
    emailTrocas: boolean;
    emailPagamentos: boolean;
    tema: 'claro' | 'escuro' | 'auto';
  };
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly API_URL = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(filters?: UsuarioFilters): Observable<Usuario[]> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<Usuario[]>(this.API_URL, { params });
  }

  getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/${id}`);
  }

  criarUsuario(usuario: Omit<Usuario, 'id' | 'dataCriacao'>): Observable<Usuario> {
    return this.http.post<Usuario>(this.API_URL, usuario);
  }

  atualizarUsuario(id: string, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/${id}`, usuario);
  }

  deletarUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getPerfil(): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(`${this.API_URL}/perfil`);
  }

  atualizarPerfil(perfil: Partial<PerfilUsuario>): Observable<PerfilUsuario> {
    return this.http.put<PerfilUsuario>(`${this.API_URL}/perfil`, perfil);
  }

  alterarSenha(senhaAtual: string, novaSenha: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/alterar-senha`, {
      senhaAtual,
      novaSenha
    });
  }

  uploadFoto(foto: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('foto', foto);
    
    return this.http.post<{ url: string }>(`${this.API_URL}/upload-foto`, formData);
  }

  getMedicosPorEspecialidade(especialidade: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API_URL}/especialidade/${especialidade}`);
  }

  ativarUsuario(id: string): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.API_URL}/${id}/ativar`, {});
  }

  desativarUsuario(id: string): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.API_URL}/${id}/desativar`, {});
  }

  bloquearUsuario(id: string, motivo: string): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.API_URL}/${id}/bloquear`, { motivo });
  }

  resetarSenha(email: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/resetar-senha`, { email });
  }
}

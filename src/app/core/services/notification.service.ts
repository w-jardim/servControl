import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

export interface Notification {
  id?: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  private connectionStatusSubject = new BehaviorSubject<boolean>(navigator.onLine);

  public notification$ = this.notificationSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor() {
    // Monitorar status de conexão
    window.addEventListener('online', () => {
      this.connectionStatusSubject.next(true);
      this.showSuccess('Conexão restaurada', 'Você está online novamente');
    });

    window.addEventListener('offline', () => {
      this.connectionStatusSubject.next(false);
      this.showWarning('Sem conexão', 'Você está offline');
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private showNotification(notification: Notification): void {
    const notificationWithId = {
      ...notification,
      id: this.generateId(),
      duration: notification.duration || 5000
    };
    
    this.notificationSubject.next(notificationWithId);
  }

  showSuccess(title: string, message: string, duration?: number): void {
    this.showNotification({
      title,
      message,
      type: 'success',
      duration
    });
  }

  showError(title: string, message: string, duration?: number): void {
    this.showNotification({
      title,
      message,
      type: 'error',
      duration: duration || 8000 // Erros ficam mais tempo
    });
  }

  showWarning(title: string, message: string, duration?: number): void {
    this.showNotification({
      title,
      message,
      type: 'warning',
      duration
    });
  }

  showInfo(title: string, message: string, duration?: number): void {
    this.showNotification({
      title,
      message,
      type: 'info',
      duration
    });
  }

  showActionNotification(
    title: string, 
    message: string, 
    type: Notification['type'],
    actionLabel: string, 
    actionCallback: () => void,
    duration?: number
  ): void {
    this.showNotification({
      title,
      message,
      type,
      duration: duration || 10000, // Notificações com ação ficam mais tempo
      action: {
        label: actionLabel,
        callback: actionCallback
      }
    });
  }

  // Métodos de conveniência para notificações específicas do sistema
  plantaoCreated(plantaoId: string): void {
    this.showSuccess(
      'Plantão criado',
      `Plantão ${plantaoId} foi criado com sucesso`
    );
  }

  plantaoUpdated(plantaoId: string): void {
    this.showSuccess(
      'Plantão atualizado',
      `Plantão ${plantaoId} foi atualizado com sucesso`
    );
  }

  plantaoDeleted(): void {
    this.showSuccess(
      'Plantão excluído',
      'Plantão foi excluído com sucesso'
    );
  }

  trocaSolicitada(): void {
    this.showSuccess(
      'Troca solicitada',
      'Sua solicitação de troca foi enviada'
    );
  }

  trocaAceita(): void {
    this.showSuccess(
      'Troca aceita',
      'A troca foi aceita com sucesso'
    );
  }

  trocaRejeitada(): void {
    this.showWarning(
      'Troca rejeitada',
      'A solicitação de troca foi rejeitada'
    );
  }

  pagamentoEfetuado(valor: number): void {
    this.showSuccess(
      'Pagamento efetuado',
      `Pagamento de R$ ${valor.toFixed(2)} foi processado`
    );
  }

  loginSuccess(userName: string): void {
    this.showSuccess(
      'Login realizado',
      `Bem-vindo, ${userName}!`
    );
  }

  sessionExpired(): void {
    this.showWarning(
      'Sessão expirada',
      'Sua sessão expirou. Faça login novamente.'
    );
  }

  networkError(): void {
    this.showError(
      'Erro de conexão',
      'Não foi possível conectar ao servidor. Tente novamente.'
    );
  }

  validationError(field: string): void {
    this.showError(
      'Erro de validação',
      `Campo ${field} é obrigatório`
    );
  }

  permissionDenied(): void {
    this.showError(
      'Acesso negado',
      'Você não tem permissão para realizar esta ação'
    );
  }

  isOnline(): boolean {
    return this.connectionStatusSubject.value;
  }
}

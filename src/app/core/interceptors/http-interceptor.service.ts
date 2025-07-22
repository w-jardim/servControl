import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  private activeRequests = 0;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Incrementar contador de requisições ativas
    this.activeRequests++;
    
    // Adicionar token de autorização se disponível
    const token = this.authService.getToken();
    let authenticatedRequest = request;
    
    if (token) {
      authenticatedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Adicionar headers padrão
    authenticatedRequest = authenticatedRequest.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    return next.handle(authenticatedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      }),
      finalize(() => {
        // Decrementar contador de requisições ativas
        this.activeRequests--;
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'Ocorreu um erro inesperado';
    let errorTitle = 'Erro';

    switch (error.status) {
      case 0:
        // Erro de rede
        errorTitle = 'Erro de Conexão';
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        this.notificationService.networkError();
        break;

      case 400:
        // Bad Request
        errorTitle = 'Dados Inválidos';
        errorMessage = error.error?.message || 'Os dados enviados são inválidos.';
        this.notificationService.showError(errorTitle, errorMessage);
        break;

      case 401:
        // Unauthorized
        errorTitle = 'Não Autorizado';
        errorMessage = 'Sua sessão expirou. Faça login novamente.';
        this.authService.logout();
        this.router.navigate(['/auth/login']);
        this.notificationService.sessionExpired();
        break;

      case 403:
        // Forbidden
        errorTitle = 'Acesso Negado';
        errorMessage = 'Você não tem permissão para realizar esta ação.';
        this.notificationService.permissionDenied();
        break;

      case 404:
        // Not Found
        errorTitle = 'Não Encontrado';
        errorMessage = 'O recurso solicitado não foi encontrado.';
        this.notificationService.showError(errorTitle, errorMessage);
        break;

      case 422:
        // Unprocessable Entity (Validation Error)
        errorTitle = 'Erro de Validação';
        if (error.error?.errors) {
          // Se há erros de validação específicos
          const validationErrors = error.error.errors;
          const firstError = Object.values(validationErrors)[0] as string;
          errorMessage = firstError || 'Dados inválidos enviados.';
        } else {
          errorMessage = error.error?.message || 'Dados inválidos enviados.';
        }
        this.notificationService.showError(errorTitle, errorMessage);
        break;

      case 429:
        // Too Many Requests
        errorTitle = 'Muitas Requisições';
        errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
        this.notificationService.showWarning(errorTitle, errorMessage);
        break;

      case 500:
        // Internal Server Error
        errorTitle = 'Erro do Servidor';
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        this.notificationService.showError(errorTitle, errorMessage);
        break;

      case 502:
      case 503:
      case 504:
        // Server errors
        errorTitle = 'Servidor Indisponível';
        errorMessage = 'O servidor está temporariamente indisponível. Tente novamente mais tarde.';
        this.notificationService.showError(errorTitle, errorMessage);
        break;

      default:
        // Outros erros
        errorMessage = error.error?.message || `Erro ${error.status}: ${error.statusText}`;
        this.notificationService.showError(errorTitle, errorMessage);
        break;
    }

    // Log do erro para debugging
    console.error('HTTP Error:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      error: error.error
    });
  }

  // Método para verificar se há requisições ativas
  get hasActiveRequests(): boolean {
    return this.activeRequests > 0;
  }

  // Método para obter número de requisições ativas
  get activeRequestsCount(): number {
    return this.activeRequests;
  }
}

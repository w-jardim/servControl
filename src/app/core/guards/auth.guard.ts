import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuthentication(route, state);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuthentication(childRoute, state);
  }

  private checkAuthentication(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      // Verificar se a rota requer roles específicas
      const requiredRoles = route.data['roles'] as Array<string>;
      
      if (requiredRoles) {
        const currentUser = this.authService.getCurrentUser();
        
        if (!currentUser || !requiredRoles.includes(currentUser.role)) {
          this.notificationService.permissionDenied();
          this.router.navigate(['/dashboard']);
          return false;
        }
      }
      
      return true;
    }

    // Usuário não autenticado
    this.notificationService.showWarning(
      'Acesso restrito',
      'Você precisa fazer login para acessar esta página'
    );
    
    // Redirecionar para login, salvando a URL de destino
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    
    return false;
  }
}

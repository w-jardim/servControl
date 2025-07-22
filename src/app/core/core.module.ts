import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Services
import { AuthService } from './services/auth.service';
import { PlantaoService } from './services/plantao.service';
import { TrocaService } from './services/troca.service';
import { FinanceiroService } from './services/financeiro.service';
import { UsuarioService } from './services/usuario.service';
import { LogsService } from './services/logs.service';
import { NotificationService } from './services/notification.service';

// Guards
import { AuthGuard } from './guards/auth.guard';

// Interceptors
import { HttpInterceptorService } from './interceptors/http-interceptor.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    // Services
    AuthService,
    PlantaoService,
    TrocaService,
    FinanceiroService,
    UsuarioService,
    LogsService,
    NotificationService,
    
    // Guards
    AuthGuard,
    
    // Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}

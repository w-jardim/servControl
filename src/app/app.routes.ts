import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './modules/auth/login/login.component';

export const routes: Routes = [
  // Redirect root to login
  { 
    path: '', 
    redirectTo: '/auth/login', 
    pathMatch: 'full' 
  },
  
  // Auth routes (no layout)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        loadComponent: () => import('./modules/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  
  // Protected routes with layout
  {
    path: '',
    component: LayoutComponent,
    // canActivate: [AuthGuard], // Uncomment when guard is ready
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard/dashboard').then(m => m.Dashboard)
      }
    ]
  },
  
  // Wildcard route - must be last
  { 
    path: '**', 
    redirectTo: '/auth/login' 
  }
];

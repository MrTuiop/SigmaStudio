import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login';
import { RegisterComponent } from './features/auth/components/register/register';
import { HomePage } from './pages/home/home'
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  //{
  //  path: 'profile',
  //  loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
  //  canActivate: [authGuard]
  //},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

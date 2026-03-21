import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login';
import { RegisterComponent } from './features/auth/components/register/register';
import { HomePage } from './features/home/home'
import { authGuard } from './core/guards/auth.guard';
import { ProjectsPage } from './features/projects/projects';
import { AboutPage } from './features/about/about';
import { ChatPage } from './features/chat/chat';
import { AdminPage } from './features/admin/admin';
import { CloudPage } from './features/cloud/cloud';
import { roleGuard } from './core/guards/role.guard';
import { ProfilePage } from './features/profile/profile';
import { AdminDashboardPage } from './features/admin/dashboard/dashboard';
import { AdminUsersPage } from './features/admin/users/users';

const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'projects', component: ProjectsPage },
  { path: 'chat', component: ChatPage },
  {
    path: 'profile',
    component: ProfilePage,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardPage },
      { path: 'users', component: AdminUsersPage }
    ],
    canActivate:[roleGuard(['Admin'])]
  },
  {
    path: 'cloud',
    component: CloudPage,
    canActivate: [roleGuard(['Admin'])]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

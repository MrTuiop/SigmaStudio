import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login';
import { RegisterComponent } from './features/auth/components/register/register';
import { HomePage } from './pages/home/home'
import { authGuard } from './core/guards/auth.guard';
import { ProjectsPage } from './pages/projects/projects';
import { AboutPage } from './pages/about/about';
import { ChatPage } from './pages/chat/chat';
import { AdminPage } from './pages/admin/admin';
import { CloudPage } from './pages/cloud/cloud';
import { roleGuard } from './core/guards/role.guard';

const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'projects', component: ProjectsPage },
  { path: 'about', component: AboutPage },
  { path: 'chat', component: ChatPage },
  {
    path: 'admin',
    component: AdminPage,
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

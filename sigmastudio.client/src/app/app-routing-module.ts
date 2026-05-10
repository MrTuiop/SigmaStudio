import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login';
import { RegisterComponent } from './features/auth/components/register/register';
import { HomePage } from './features/home/home'
import { authGuard } from './core/guards/auth.guard';
import { ProjectsPage } from './features/projects/projects';
import { AboutPage } from './features/about/about';
import { ChatPage } from './features/chat/chat';
import { CloudPage } from './features/cloud/cloud';
import { roleGuard } from './core/guards/role.guard';
import { ProjectGuard } from './core/guards/project-guard';
import { AdminDashboardPage } from './features/admin/dashboard/dashboard';
import { AdminUsersPage } from './features/admin/users/users';
import { ProfileDashboardPage } from './features/profile/dashboard/dashboard';
import { ProfileSecurityPage } from './features/profile/security/security';
import { ProjectPage } from './features/projects/project/project';
import { ProjectResolver } from './features/projects/resolvers/project.resolver';
import { ProjectEditPage } from './features/projects/project/project-edit/project-edit';

const routes: Routes = [
  { path: '', component: HomePage, data: { pageTitle: '' }, title: 'SigmaStudio' },
  {
    path: 'projects',
    data: { pageTitle: 'Проекты' },
    title: 'Проекты',
    children: [
      { path: '', component: ProjectsPage },     
      {
        path: ':slug',                               
        component: ProjectPage,
        canActivate: [ProjectGuard],
        resolve: { project: ProjectResolver },
        data: { pageTitle: '' },
        title: 'Просмотр проекта'
      },
      {
        path: ':slug/edit',
        component: ProjectEditPage,
        canActivate: [ProjectGuard],
        resolve: { project: ProjectResolver },
        title: 'Редактирование проекта',
        data: { pageTitle: '' }
      }
    ]
  },
  { path: 'chat', component: ChatPage },
  {
    path: 'profile',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ProfileDashboardPage },
      { path: 'security', component: ProfileSecurityPage }
    ],
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
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    scrollOffset: [0, 0]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

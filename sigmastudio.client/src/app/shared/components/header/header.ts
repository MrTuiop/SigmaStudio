import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  isInSection: boolean = false;
  currentSection: string = '';
  projectSlug: string | null = null;
  private routerSub: Subscription = new Subscription();

  constructor(public authService: AuthService, private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.updateMenuState());

    this.updateMenuState();
  }

  private updateMenuState(): void {
    let route = this.router.routerState.snapshot.root;
    while (route.children.length) {
      route = route.children[0];
    }

    const data = route.data;
    const url = this.router.url;
    const menuSection = data['menuSection'] || this.detectSectionByUrl(url);

    this.isInSection = !!menuSection;
    this.currentSection = menuSection;

    // 👇 Логика только для секции Projects
    if (menuSection === 'projects') {
      this.projectSlug = route.paramMap.get('slug') || null;
      // Исключаем статические пути, чтобы не показывать ссылку на список
      if (!this.projectSlug || this.projectSlug === 'create') {
        this.projectSlug = null;
      }
    } else {
      this.projectSlug = null;
    }
  }

  goBack(): void {
    this.location.back();
  }

  private detectSectionByUrl(url: string): string {
    if (url.startsWith('/admin')) return 'admin';
    if (url.startsWith('/profile')) return 'profile';
    if (url.startsWith('/projects')) return 'projects';
    return '';
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }
}

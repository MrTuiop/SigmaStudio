import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  isInSection: boolean = false;
  currentSection: string = '';
  private sectionRoutes = ['/admin', '/profile'];
  private routerSub: Subscription = new Subscription();

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkRoute(event.urlAfterRedirects);
      });

    this.checkRoute(this.router.url);
  }

  private checkRoute(url: string): void {
    const matchedSection = this.sectionRoutes.find(route => url.startsWith(route));

    if (matchedSection) {
      this.isInSection = true;
      this.currentSection = matchedSection;
    } else {
      this.isInSection = false;
      this.currentSection = '';
    }
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}

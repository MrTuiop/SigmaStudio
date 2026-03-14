import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service'

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage implements OnInit {
  roles: string[] = [];

  constructor(private http: HttpClient, public authService: AuthService) { }

  ngOnInit() {

  }

  protected readonly title = signal('sigmastudio.client');
}

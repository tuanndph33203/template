import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '@app/core/models/auth';
import { AuthStore } from '@app/feature/auth/services/auth.store';
import { Button, ButtonDirective } from 'primeng/button';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'app-header',
  imports: [Popover, Button, ButtonDirective],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  auth = inject(AuthStore);
  router = inject(Router);

  user = signal<IUser | null>(null);

  ngOnInit(): void {
    this.user.set(this.auth.getUser());
  }

  logout() {
    this.auth.setAuth(null);
    this.router.navigate(['/']);
  }
}

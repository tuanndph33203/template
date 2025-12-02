import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { AuthStore } from '@app/core/auth/auth.store';
import { IUser } from '@app/core/model/auth';
import { Button, ButtonModule } from 'primeng/button';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'app-header',
  imports: [Popover, ButtonModule],
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

import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IUser } from '@app/core/models/auth';
import { AuthStore } from '@app/feature/auth/services/auth.store';
import { Button, ButtonDirective } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { Breadcrumb } from 'primeng/breadcrumb';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [Popover, Button, ButtonDirective, Breadcrumb, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  user = signal<IUser | null>(null);
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/dashboard' };
  items = signal<MenuItem[]>([]);

  auth = inject(AuthStore);
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.user.set(this.auth.getUser());
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const crumbs = this.buildBreadcrumb(this.route.root);
        this.items.set(crumbs);
      });
  }

  buildBreadcrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: MenuItem[] = []
  ): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL = child.snapshot.url.map(seg => seg.path).join('/');
      if (routeURL) {
        url += `/${routeURL}`;
      }
      const title = child.snapshot.data['title'];

      if (title) {
        breadcrumbs.push({
          label: title,
          routerLink: url || '/dashboard',
        });
      }
      return this.buildBreadcrumb(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }


  logout() {
    this.auth.setAuth(null);
    this.router.navigate(['/']);
  }
}

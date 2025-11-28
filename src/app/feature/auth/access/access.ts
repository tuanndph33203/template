import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button, ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'app-access',
  imports: [Button, Card, Avatar],
  templateUrl: './access.html',
  styleUrl: './access.scss',
})
export class Access {
  router = inject(Router);
  redirect(link: string) {
    this.router.navigate([link]);
  }
}

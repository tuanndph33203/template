import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-not-found',
  imports: [Button, Card, Avatar],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  router = inject(Router);
  redirect(link: string) {
    this.router.navigate([link]);
  }
}

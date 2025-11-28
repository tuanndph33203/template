import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-error',
  imports: [Button, Card, Avatar],
  templateUrl: './error.html',
  styleUrl: './error.scss',
})
export class Error {
  router = inject(Router);
  redirect(link: string) {
    this.router.navigate([link]);
  }
}

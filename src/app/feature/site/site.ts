import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { Header } from '@app/core/layout/header/header';

@Component({
  selector: 'app-site',
  imports: [RouterOutlet, Header],
  templateUrl: './site.html',
  styleUrl: './site.scss',
})
export class Site {}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
@Component({
  selector: 'app-site-layout',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './site-layout.html',
  styleUrl: './site-layout.scss',
})
export class SiteLayout {}

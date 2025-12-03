import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  authService = inject(AuthService);
  ngOnInit(): void {
    this.authService.redirectMicrosoft();
  }
}

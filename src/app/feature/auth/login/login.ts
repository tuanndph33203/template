import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@app/core/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  authService = inject(AuthService);
  ngOnInit(): void {
    this.authService.redirectMicrosoft();
  }
}

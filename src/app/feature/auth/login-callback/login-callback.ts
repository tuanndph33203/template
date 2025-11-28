import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login-callback',
  imports: [],
  templateUrl: './login-callback.html',
  styleUrl: './login-callback.scss',
})
export class LoginCallback implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  private messageService = inject(MessageService);

  ngOnInit() {
    const section = this.route.snapshot.queryParamMap.get('sectionId');
    if (section) {
      this.authService.loginBySectionId(section).subscribe(
        () => {
          this.router.navigate(['/dashboard']);
        },
        () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Không thể đăng nhập!',
            detail: 'Vui lòng thử lại sau',
          });
          return;
        },
      );
    } else {
      console.warn('Không tìm thấy token từ callback');
      this.router.navigate(['/error']);
    }
  }
}

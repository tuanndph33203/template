import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

}
